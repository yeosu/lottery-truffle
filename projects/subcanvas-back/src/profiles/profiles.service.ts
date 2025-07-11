import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../services/s3.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import * as crypto from 'crypto';

@Injectable()
export class ProfilesService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  // 프로필 페이지 CRUD 작업
  async createProfilePage(userId: string, createProfileDto: CreateProfileDto) {
    // URL 경로 중복 확인
    const existingProfile = await this.prisma.profilePage.findUnique({
      where: { pagePath: createProfileDto.pagePath },
    });

    if (existingProfile) {
      throw new ConflictException('이미 사용 중인 URL 경로입니다.');
    }

    // 프로필 페이지 생성
    return this.prisma.profilePage.create({
      data: {
        userId,
        pagePath: createProfileDto.pagePath,
        designConcept: createProfileDto.designConcept,
      },
    });
  }

  async getProfilePagesByUserId(userId: string) {
    return this.prisma.profilePage.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            contents: true,
            visits: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getProfilePageById(profileId: number) {
    const profilePage = await this.prisma.profilePage.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
        contents: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
        _count: {
          select: {
            visits: true,
          },
        },
      },
    });

    if (!profilePage) {
      throw new NotFoundException('프로필 페이지를 찾을 수 없습니다.');
    }

    return profilePage;
  }

  async getProfilePageByPath(pagePath: string, visitorIp?: string) {
    const profilePage = await this.prisma.profilePage.findUnique({
      where: { pagePath },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
        contents: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
        _count: {
          select: {
            visits: true,
          },
        },
      },
    });

    if (!profilePage) {
      throw new NotFoundException('프로필 페이지를 찾을 수 없습니다.');
    }

    // 방문 기록 저장 (방문자 IP가 제공된 경우)
    if (visitorIp) {
      // IP 주소를 해시 처리하여 개인정보 보호
      const visitorIpHash = crypto
        .createHash('sha256')
        .update(visitorIp)
        .digest('hex');

      // 방문 기록 저장
      await this.prisma.pageVisit.create({
        data: {
          profileId: profilePage.id,
          visitorIpHash,
        },
      });
    }

    return profilePage;
  }

  async updateProfilePage(
    userId: string,
    profileId: number,
    updateProfileDto: UpdateProfileDto,
  ) {
    // 프로필 페이지 존재 여부 및 소유권 확인
    const profilePage = await this.prisma.profilePage.findUnique({
      where: { id: profileId },
    });

    if (!profilePage) {
      throw new NotFoundException('프로필 페이지를 찾을 수 없습니다.');
    }

    if (profilePage.userId !== userId) {
      throw new ForbiddenException('이 프로필 페이지를 수정할 권한이 없습니다.');
    }

    // URL 경로 중복 확인 (변경하는 경우에만)
    if (
      updateProfileDto.pagePath &&
      updateProfileDto.pagePath !== profilePage.pagePath
    ) {
      const existingProfile = await this.prisma.profilePage.findUnique({
        where: { pagePath: updateProfileDto.pagePath },
      });

      if (existingProfile) {
        throw new ConflictException('이미 사용 중인 URL 경로입니다.');
      }
    }

    // 프로필 페이지 업데이트
    return this.prisma.profilePage.update({
      where: { id: profileId },
      data: {
        pagePath: updateProfileDto.pagePath,
        designConcept: updateProfileDto.designConcept,
      },
    });
  }

  async deleteProfilePage(userId: string, profileId: number) {
    // 프로필 페이지 존재 여부 및 소유권 확인
    const profilePage = await this.prisma.profilePage.findUnique({
      where: { id: profileId },
    });

    if (!profilePage) {
      throw new NotFoundException('프로필 페이지를 찾을 수 없습니다.');
    }

    if (profilePage.userId !== userId) {
      throw new ForbiddenException('이 프로필 페이지를 삭제할 권한이 없습니다.');
    }

    // 프로필 페이지 삭제 (관련 콘텐츠, 방문 기록은 cascade로 자동 삭제)
    await this.prisma.profilePage.delete({
      where: { id: profileId },
    });

    return { message: '프로필 페이지가 삭제되었습니다.' };
  }

  // 프로필 콘텐츠 CRUD 작업
  async createProfileContent(
    userId: string,
    profileId: number,
    createContentDto: CreateContentDto,
  ) {
    // 프로필 페이지 존재 여부 및 소유권 확인
    const profilePage = await this.prisma.profilePage.findUnique({
      where: { id: profileId },
    });

    if (!profilePage) {
      throw new NotFoundException('프로필 페이지를 찾을 수 없습니다.');
    }

    if (profilePage.userId !== userId) {
      throw new ForbiddenException('이 프로필 페이지에 콘텐츠를 추가할 권한이 없습니다.');
    }

    // 현재 가장 높은 표시 순서 찾기
    const maxOrder = await this.prisma.profileContent.aggregate({
      where: { profileId },
      _max: { displayOrder: true },
    });

    const displayOrder = maxOrder._max.displayOrder
      ? maxOrder._max.displayOrder + 1
      : 1;

    // 콘텐츠 생성
    return this.prisma.profileContent.create({
      data: {
        profileId,
        contentType: createContentDto.contentType,
        contentValue: createContentDto.contentValue,
        displayOrder,
      },
    });
  }

  async updateProfileContent(
    userId: string,
    contentId: number,
    updateContentDto: UpdateContentDto,
  ) {
    // 콘텐츠 존재 여부 확인
    const content = await this.prisma.profileContent.findUnique({
      where: { id: contentId },
      include: { profilePage: true },
    });

    if (!content) {
      throw new NotFoundException('콘텐츠를 찾을 수 없습니다.');
    }

    // 소유권 확인
    if (content.profilePage.userId !== userId) {
      throw new ForbiddenException('이 콘텐츠를 수정할 권한이 없습니다.');
    }

    // 콘텐츠 업데이트
    return this.prisma.profileContent.update({
      where: { id: contentId },
      data: {
        contentType: updateContentDto.contentType,
        contentValue: updateContentDto.contentValue,
        displayOrder: updateContentDto.displayOrder,
      },
    });
  }

  async deleteProfileContent(userId: string, contentId: number) {
    // 콘텐츠 존재 여부 확인
    const content = await this.prisma.profileContent.findUnique({
      where: { id: contentId },
      include: { profilePage: true },
    });

    if (!content) {
      throw new NotFoundException('콘텐츠를 찾을 수 없습니다.');
    }

    // 소유권 확인
    if (content.profilePage.userId !== userId) {
      throw new ForbiddenException('이 콘텐츠를 삭제할 권한이 없습니다.');
    }

    // 콘텐츠 삭제
    await this.prisma.profileContent.delete({
      where: { id: contentId },
    });

    return { message: '콘텐츠가 삭제되었습니다.' };
  }

  // 파일 업로드 처리
  async uploadImage(userId: string, file: Express.Multer.File) {
    try {
      // 실제 서비스에서는 S3 업로드 사용
      const fileUrl = await this.s3Service.uploadFile(file.buffer, file.originalname);
      return { url: fileUrl };
    } catch (error) {
      // S3 업로드 실패 시 로컬 저장된 URL 반환 (개발 환경용)
      const fileUrl = `http://localhost:3000/uploads/profiles/${file.filename}`;
      return { url: fileUrl };
    }
  }

  // 방문 통계 조회
  async getVisitStats(userId: string, profileId: number, period: 'day' | 'week' | 'month' = 'day') {
    // 프로필 페이지 존재 여부 및 소유권 확인
    const profilePage = await this.prisma.profilePage.findUnique({
      where: { id: profileId },
    });

    if (!profilePage) {
      throw new NotFoundException('프로필 페이지를 찾을 수 없습니다.');
    }

    if (profilePage.userId !== userId) {
      throw new ForbiddenException('이 프로필 페이지의 통계를 조회할 권한이 없습니다.');
    }

    let startDate = new Date();
    const endDate = new Date();

    // 기간 설정
    if (period === 'day') {
      // 오늘 하루 (24시간)
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      // 일주일
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      // 한달
      startDate.setMonth(startDate.getMonth() - 1);
    }

    // 방문 기록 집계
    const visits = await this.prisma.pageVisit.findMany({
      where: {
        profileId,
        visitedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        visitedAt: 'asc',
      },
    });

    // 중복 방문자 수 계산 (IP 해시 기준)
    const uniqueVisitors = new Set(
      visits.map((visit) => visit.visitorIpHash).filter(Boolean)
    ).size;

    return {
      totalVisits: visits.length,
      uniqueVisitors,
      period,
      startDate,
      endDate,
    };
  }

  // 불량/문제 페이지 신고 처리
  async reportAbusivePage(
    reporterUserId: string | null,
    reportedProfileId: number,
    reportCategory: string,
    reportDetails: string | null,
  ) {
    // 신고 대상 프로필 페이지 존재 확인
    const profilePage = await this.prisma.profilePage.findUnique({
      where: { id: reportedProfileId },
    });

    if (!profilePage) {
      throw new NotFoundException('신고하려는 프로필 페이지를 찾을 수 없습니다.');
    }

    // 신고 생성
    return this.prisma.abuseReport.create({
      data: {
        reportedProfileId,
        reporterUserId,
        reportCategory,
        reportDetails,
        status: 'PENDING',
      },
    });
  }

  // 관리자용 신고 처리 메서드
  async getAbuseReports(status?: string, skip = 0, take = 10) {
    const whereCondition = status ? { status } : {};

    const [reports, total] = await Promise.all([
      this.prisma.abuseReport.findMany({
        where: whereCondition,
        include: {
          reportedProfile: {
            select: {
              id: true,
              pagePath: true,
              user: {
                select: {
                  id: true,
                  nickname: true,
                  email: true,
                },
              },
            },
          },
          reporterUser: {
            select: {
              id: true,
              nickname: true,
              email: true,
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.abuseReport.count({ where: whereCondition }),
    ]);

    return { reports, total };
  }

  async updateAbuseReportStatus(
    reportId: number,
    status: 'PENDING' | 'REVIEWING' | 'RESOLVED',
  ) {
    return this.prisma.abuseReport.update({
      where: { id: reportId },
      data: { status },
    });
  }
}
