import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateProfileDto {
  @IsString({ message: 'URL 경로는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: 'URL 경로는 필수입니다.' })
  @Matches(/^[a-z0-9\-_]+$/, {
    message: 'URL 경로는 소문자, 숫자, 하이픈, 언더스코어만 포함할 수 있습니다.',
  })
  pagePath: string;

  @IsOptional()
  @IsString({ message: '디자인 컨셉은 문자열이어야 합니다.' })
  designConcept?: string;
}
