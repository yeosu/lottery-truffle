import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SocialLoginDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수입니다.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임은 필수입니다.' })
  nickname: string;

  @IsString()
  @IsNotEmpty({ message: '인증 제공자 정보는 필수입니다.' })
  provider: string;

  @IsString()
  @IsNotEmpty({ message: '제공자 ID는 필수입니다.' })
  providerId: string;
}
