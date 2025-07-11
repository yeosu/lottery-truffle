import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // 사용자가 존재하지 않는 경우
    if (!user) {
      return null;
    }

    // 소셜 로그인 사용자가 이메일/비밀번호로 로그인 시도하는 경우 거부
    if (user.authProvider !== 'LOCAL') {
      throw new UnauthorizedException(
        `${user.authProvider} 계정으로 가입된 이메일입니다. 소셜 로그인을 이용해주세요.`,
      );
    }

    // 사용자 상태 확인
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(
        '계정이 활성화 상태가 아닙니다. 관리자에게 문의하세요.',
      );
    }

    // 비밀번호 검증 (소셜 로그인이 아닐 때만)
    if (user.passwordHash) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return null;
      }
    }

    // 마지막 로그인 시간 업데이트
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // 인증 정보에서 제외할 필드 (비밀번호 등 민감 정보)
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
      },
    };
  }

  async register(email: string, password: string, nickname: string) {
    // 이메일 중복 확인
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 비밀번호 해시화
    const passwordHash = await bcrypt.hash(password, 10);

    // 사용자 생성
    const newUser = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        nickname,
        authProvider: 'LOCAL',
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    // 민감 정보 제외
    const { passwordHash: _, ...result } = newUser;

    return this.login(result);
  }

  // 소셜 로그인 처리 (Google, Kakao 등)
  async socialLogin(socialData: { email: string; nickname: string; provider: string; providerId: string }) {
    const { email, nickname, provider, providerId } = socialData;

    // 이미 가입된 사용자인지 확인
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // 이미 존재하는 사용자이지만 소셜 로그인 정보가 일치하지 않는 경우
      if (user.authProvider !== provider || user.providerId !== providerId) {
        throw new ConflictException(
          `이미 ${user.authProvider} 계정으로 가입된 이메일입니다.`,
        );
      }
      
      // 마지막 로그인 시간 업데이트
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    } else {
      // 새 사용자 생성
      user = await this.prisma.user.create({
        data: {
          email,
          nickname,
          authProvider: provider,
          providerId,
          role: 'USER',
          status: 'ACTIVE',
        },
      });
    }

    // 민감 정보 제외
    const { passwordHash: _, ...result } = user;

    return this.login(result);
  }
}
