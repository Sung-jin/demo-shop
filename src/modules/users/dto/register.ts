import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString, Matches, Validate} from "class-validator";
import {PasswordValidator} from '@/common/validator/passwordValidator';

export class Register {
  @ApiProperty({ description: '회원가입에 사용 될 아이디' })
  @IsNotEmpty()
  loginId: string;

  @ApiProperty({ description: '암호화 된 사용자 패스워드' })
  @IsNotEmpty()
  @IsString()
  @Validate(PasswordValidator)
  password: string;

  @ApiProperty({ description: '사용자 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '사용자 핸드폰 번호',
    maximum: 11,
  })
  @Matches(/^(\+\d{1,3}[- ]?)?\d{11}$/, {
    message: 'phone must be a phone number',
  })
  phone: string;
}
