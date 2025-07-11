import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateContentDto {
  @IsString({ message: '콘텐츠 유형은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '콘텐츠 유형은 필수입니다.' })
  @IsIn(['IMAGE', 'BIO_TEXT', 'LINK'], { 
    message: '콘텐츠 유형은 IMAGE, BIO_TEXT, LINK 중 하나여야 합니다.' 
  })
  contentType: string;

  @IsString({ message: '콘텐츠 값은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '콘텐츠 값은 필수입니다.' })
  contentValue: string;
}
