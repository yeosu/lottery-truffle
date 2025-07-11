import { IsString, IsNotEmpty, IsIn, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateContentDto {
  @IsOptional()
  @IsString({ message: '콘텐츠 유형은 문자열이어야 합니다.' })
  @IsIn(['IMAGE', 'BIO_TEXT', 'LINK'], { 
    message: '콘텐츠 유형은 IMAGE, BIO_TEXT, LINK 중 하나여야 합니다.' 
  })
  contentType?: string;

  @IsOptional()
  @IsString({ message: '콘텐츠 값은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '콘텐츠 값은 필수입니다.' })
  contentValue?: string;
  
  @IsOptional()
  @IsNumber({}, { message: '표시 순서는 숫자여야 합니다.' })
  @Min(0, { message: '표시 순서는 0 이상이어야 합니다.' })
  displayOrder?: number;
}
