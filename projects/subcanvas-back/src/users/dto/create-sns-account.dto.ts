import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateSnsAccountDto {
  @IsString({ message: 'SNS 유형은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: 'SNS 유형은 필수입니다.' })
  snsType: string;

  @IsString({ message: 'SNS URL은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: 'SNS URL은 필수입니다.' })
  @IsUrl({}, { message: '유효한 URL 형식이어야 합니다.' })
  snsUrl: string;
}
