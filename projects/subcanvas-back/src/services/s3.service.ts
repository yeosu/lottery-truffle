import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import { promises as fsPromises } from 'fs';
import { SupabaseService } from './supabase.service';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private useSupabase: boolean = false;
  
  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService
  ) {
    // Supabase 설정 확인
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');
    
    if (supabaseUrl && supabaseKey) {
      this.useSupabase = true;
      console.log('Supabase Storage를 사용합니다.');
    }
    
    // 대체 S3 설정 확인
    if (!this.useSupabase) {
      const region = this.configService.get<string>('AWS_REGION');
      const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
      const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
      
      // 보안을 위해 자격 증명이 모두 존재할 때만 S3 클라이언트 생성
      if (region && accessKeyId && secretAccessKey) {
        this.s3Client = new S3Client({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });
        console.log('AWS S3를 사용합니다.');
      } else {
        console.warn('S3/Supabase 설정이 없어 로컬 저장소를 사용합니다.');
      }
    }
  }

  /**
   * 파일 업로드 - Supabase Storage 또는 AWS S3, 아니면 로컬
   * @param fileBuffer 파일 버퍼
   * @param key 저장될 파일 키(경로 포함)
   * @param mimeType 파일 형식 (image/jpeg 등)
   * @returns 업로드된 파일의 URL 또는 로컬 경로
   */
  async uploadFile(fileBuffer: Buffer, key: string, mimeType: string = 'image/jpeg'): Promise<string> {
    // 1. Supabase Storage 사용 시도
    if (this.useSupabase) {
      try {
        const bucketName = this.configService.get<string>('SUPABASE_BUCKET_NAME') || 'subcanvas-storage';
        
        // Blob 객체로 변환
        const blob = new Blob([fileBuffer], { type: mimeType });
        const file = new File([blob], key.split('/').pop() || 'file', { type: mimeType });
        
        const result = await this.supabaseService.uploadFile(bucketName, key, file);
        if (result) {
          return this.supabaseService.getFileUrl(bucketName, key);
        }
      } catch (error) {
        console.error('Supabase Storage 업로드 실패:', error);
        // Supabase 실패 시 S3 사용 시도
      }
    }
    
    // 2. AWS S3 사용 시도
    if (this.s3Client) {
      const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
      if (bucketName) {
        try {
          const upload = new Upload({
            client: this.s3Client,
            params: {
              Bucket: bucketName,
              Key: key,
              Body: fileBuffer,
              ContentType: mimeType,
            },
          });
      
          await upload.done();
          return `https://${bucketName}.s3.amazonaws.com/${key}`;
        } catch (error) {
          console.error('AWS S3 업로드 실패:', error);
          // S3 실패 시 로컬 저장소 사용
        }
      }
    }
    
    // 3. 로컬 저장소 사용 (모든 대안이 실패했을 때)
    return this.saveToLocal(fileBuffer, key);
  }

  /**
   * 파일을 로컬 저장소에 저장
   * @param fileBuffer 파일 데이터
   * @param key 파일 경로/이름
   * @returns 저장된 경로
   */
  private async saveToLocal(fileBuffer: Buffer, key: string): Promise<string> {
    // key가 undefined나 null인 경우 문제가 발생하지 않도록 처리
    if (!key) {
      console.warn('파일 키가 없습니다. 임시 파일 이름을 생성합니다.');
      key = `temp-${Date.now()}.jpg`;
    }

    // 경로 구분자를 일관되게 사용하기 위해 key의 경로 구분자를 변환
    const normalizedKey = key.replace(/\//g, path.sep);
    const dirPath = path.join(process.cwd(), 'uploads', path.dirname(normalizedKey));
    const filePath = path.join(process.cwd(), 'uploads', normalizedKey);
    
    try {
      // 디렉토리가 없으면 생성
      await fsPromises.mkdir(dirPath, { recursive: true });
      
      // 파일 저장
      await fsPromises.writeFile(filePath, fileBuffer);
      
      // 상대 URL 경로 반환
      return `/uploads/${normalizedKey.replace(/\\/g, '/')}`;
    } catch (error) {
      console.error('파일 저장 오류:', error);
      throw new Error('파일 저장 중 오류가 발생했습니다.');
    }
  }

  /**
   * 파일 삭제 - Supabase Storage 또는 AWS S3, 아니면 로컬
   * @param key 삭제할 파일 키
   */
  async deleteFile(key: string): Promise<void> {
    // 1. Supabase Storage 사용 시도
    if (this.useSupabase) {
      try {
        const bucketName = this.configService.get<string>('SUPABASE_BUCKET_NAME') || 'subcanvas-storage';
        await this.supabaseService.deleteFile(bucketName, key);
        return; // 성공적으로 삭제됨
      } catch (error) {
        console.error('Supabase Storage 파일 삭제 실패:', error);
        // Supabase 실패 시 S3 사용 시도
      }
    }
    
    // 2. AWS S3 사용 시도
    if (this.s3Client) {
      const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
      if (bucketName) {
        try {
          await this.s3Client.send(
            new DeleteObjectCommand({
              Bucket: bucketName,
              Key: key,
            }),
          );
          return; // 성공적으로 삭제됨
        } catch (error) {
          console.error('AWS S3 파일 삭제 실패:', error);
          // S3 실패 시 로컬 파일 삭제 시도
        }
      }
    }
    
    // 3. 로컬 저장소에서 파일 삭제 (모든 대안이 실패했을 때)
    await this.deleteLocalFile(key).catch(e => console.error('로컬 파일 삭제 실패:', e));
  }
  
  /**
   * 로컬 저장소에서 파일 삭제
   * @param key 파일 경로/이름
   */
  async deleteLocalFile(key: string): Promise<void> {
    try {
      // key가 undefined나 null인 경우 문제가 발생하지 않도록 처리
      if (!key) {
        console.warn('파일 키가 없습니다. 삭제를 건너뛰니다.');
        return;
      }
      
      const filePath = path.join(process.cwd(), 'uploads', key);
      if (fs.existsSync(filePath)) {
        await fsPromises.unlink(filePath);
      }
    } catch (error) {
      console.error('로컬 파일 삭제 실패:', error);
    }
  }

  /**
   * 파일 확장자에 따른 Content-Type 반환
   * @param filename - 파일 이름
   * @returns - Content-Type
   */
  private getContentType(filename: string): string {
    const ext = filename.split('.').pop().toLowerCase();
    
    const contentTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    return contentTypes[ext] || 'application/octet-stream';
  }
}
