import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 엔드포인트에 지정된 역할 가져오기
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // 역할이 지정되지 않은 경우 접근 허용
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    // 사용자 정보가 없는 경우 접근 거부
    if (!user) {
      return false;
    }
    
    // 사용자의 역할이 요구되는 역할 중 하나라도 일치하는지 확인
    return requiredRoles.some((role) => user.role === role);
  }
}
