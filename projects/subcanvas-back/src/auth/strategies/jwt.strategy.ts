import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    // 토큰에서 추출한 사용자 정보로 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: { 
        id: payload.sub,
        email: payload.email,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        status: true,
      }
    });

    // 사용자가 존재하지 않거나 차단/휴면 상태인 경우 접근 거부
    if (!user || user.status !== 'ACTIVE') {
      return null;
    }

    return user;
  }
}
