import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService, S3Service, SupabaseService } from './services';

@Module({
  imports: [
    // 환경변수 설정
    ConfigModule.forRoot(),
    
    // 정적 파일 서빙 (이미지 업로드용)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    
    // 모듈 등록
    UsersModule,
    AuthModule,
    ProfilesModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService, S3Service],
})
export class AppModule {}
