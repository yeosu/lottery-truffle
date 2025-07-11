import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  
  // CORS 설정
  app.enableCors();
  
  // 전역 ValidationPipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 속성 제거
      forbidNonWhitelisted: true, // DTO에 없는 속성이 있으면 요청 거부
      transform: true, // 요청 데이터를 DTO 인스턴스로 변환
    }),
  );
  
  // 업로드 디렉토리 설정
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  
  // API 접두사 설정
  app.setGlobalPrefix('api');
  
  // 포트 설정
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`애플리케이션이 ${port} 포트에서 실행 중입니다.`);
}
bootstrap();
