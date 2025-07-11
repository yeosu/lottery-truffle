import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        authProvider: true,
        snsAccounts: {
          select: {
            id: true,
            snsType: true,
            snsUrl: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 업데이트할 데이터 준비
    const updateData: any = {};

    // 닉네임 업데이트
    if (updateUserDto.nickname) {
      updateData.nickname = updateUserDto.nickname;
    }

    // 비밀번호 업데이트 (로컬 로그인 사용자만 가능)
    if (updateUserDto.password) {
      if (user.authProvider !== 'LOCAL') {
        throw new BadRequestException('소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다.');
      }

      // 현재 비밀번호 확인
      if (!updateUserDto.currentPassword) {
        throw new BadRequestException('현재 비밀번호를 입력해주세요.');
      }

      // passwordHash가 null이 아닌지 확인
      if (!user.passwordHash) {
        throw new BadRequestException('비밀번호가 설정되어 있지 않습니다.');
      }
      
      const isPasswordValid = await bcrypt.compare(
        updateUserDto.currentPassword,
        user.passwordHash
      );

      if (!isPasswordValid) {
        throw new BadRequestException('현재 비밀번호가 올바르지 않습니다.');
      }

      // 새 비밀번호 해싱
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    // 사용자 정보 업데이트
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        authProvider: true,
      },
    });

    return updatedUser;
  }

  async deleteUser(userId: string, currentPassword?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 로컬 로그인 사용자의 경우 비밀번호 확인 필요
    if (user.authProvider === 'LOCAL' && user.passwordHash) {
      if (!currentPassword) {
        throw new BadRequestException('계정 삭제를 위해 현재 비밀번호를 입력해주세요.');
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.passwordHash,
      );

      if (!isPasswordValid) {
        throw new ForbiddenException('비밀번호가 올바르지 않습니다.');
      }
    }

    // 사용자 삭제 (관련 데이터는 cascade 설정에 따라 자동 삭제)
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: '계정이 성공적으로 삭제되었습니다.' };
  }

  // SNS 계정 관리 메서드들
  async addSnsAccount(userId: string, snsType: string, snsUrl: string) {
    await this.findById(userId); // 사용자 존재 여부 확인
    
    return await this.prisma.snsAccount.create({
      data: {
        userId,
        snsType,
        snsUrl,
      },
    });
  }

  async deleteSnsAccount(userId: string, snsAccountId: number) {
    const snsAccount = await this.prisma.snsAccount.findUnique({
      where: { id: snsAccountId },
    });

    if (!snsAccount) {
      throw new NotFoundException('SNS 계정을 찾을 수 없습니다.');
    }

    if (snsAccount.userId !== userId) {
      throw new ForbiddenException('다른 사용자의 SNS 계정을 삭제할 수 없습니다.');
    }

    return await this.prisma.snsAccount.delete({
      where: { id: snsAccountId },
    });
  }

  // 관리자용 사용자 관리 메서드들
  async getAllUsers(skip = 0, take = 10) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          nickname: true,
          role: true,
          status: true,
          createdAt: true,
          lastLoginAt: true,
          authProvider: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return { users, total };
  }

  async updateUserStatus(userId: string, status: 'ACTIVE' | 'DORMANT' | 'BANNED') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        status: true,
      },
    });
  }
}
