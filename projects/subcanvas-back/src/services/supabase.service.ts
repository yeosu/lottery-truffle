import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  
  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase 설정이 없습니다. 환경 변수를 확인하세요.');
      return;
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  
  get client(): SupabaseClient {
    return this.supabase;
  }
  
  /**
   * 테이블에서 모든 데이터 조회
   */
  async findAll(table: string) {
    const { data, error } = await this.supabase
      .from(table)
      .select('*');
    
    if (error) throw error;
    return data;
  }
  
  /**
   * ID로 데이터 조회
   */
  async findById(table: string, id: string | number) {
    const { data, error } = await this.supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  /**
   * 사용자 정의 쿼리 조회
   */
  async findByQuery(table: string, query: any) {
    let builder = this.supabase.from(table).select('*');
    
    // 동적 쿼리 적용
    Object.keys(query).forEach(key => {
      if (typeof query[key] === 'object' && query[key] !== null) {
        // 비교 연산자 처리 (예: {gt: 100})
        Object.keys(query[key]).forEach(op => {
          builder = builder[op](key, query[key][op]);
        });
      } else {
        // 일반 동등 비교
        builder = builder.eq(key, query[key]);
      }
    });
    
    const { data, error } = await builder;
    
    if (error) throw error;
    return data;
  }
  
  /**
   * 데이터 생성
   */
  async create(table: string, data: any) {
    const { data: result, error } = await this.supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }
  
  /**
   * 데이터 수정
   */
  async update(table: string, id: string | number, data: any) {
    const { data: result, error } = await this.supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }
  
  /**
   * 데이터 삭제
   */
  async delete(table: string, id: string | number) {
    const { error } = await this.supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
  
  /**
   * Storage 파일 업로드
   */
  async uploadFile(bucket: string, path: string, file: any) {
    const { data, error } = await this.supabase
      .storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600',
      });
    
    if (error) throw error;
    return data;
  }
  
  /**
   * Storage 파일 삭제
   */
  async deleteFile(bucket: string, path: string) {
    const { error } = await this.supabase
      .storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
    return true;
  }
  
  /**
   * Storage 파일 URL 가져오기
   */
  getFileUrl(bucket: string, path: string) {
    const { data } = this.supabase
      .storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}
