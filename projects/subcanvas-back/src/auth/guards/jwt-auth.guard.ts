import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // JWT 토큰 검증 (상위 클래스 AuthGuard('jwt')가 처리)
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // 토큰 검증 실패 또는 에러 발생 시
    if (err || !user) {
      throw err || new UnauthorizedException('인증이 필요한 요청입니다.');
    }
    
    // 사용자 상태가 활성화되지 않은 경우
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('계정이 비활성화 상태입니다.');
    }
    
    return user;
  }
}
