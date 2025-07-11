import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 전역 모듈로 설정하여 모든 모듈에서 PrismaService를 사용할 수 있게 함
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
