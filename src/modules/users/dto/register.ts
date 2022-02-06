import {ApiProperty} from "@nestjs/swagger";

export class Register {
  @ApiProperty({ description: '회원가입에 사용 될 아이디' })
  loginId: string;

  @ApiProperty({ description: '암호화 된 사용자 패스워드' })
  password: string;

  @ApiProperty({ description: '사용자 이메일' })
  email: string;

  @ApiProperty({
    description: '사용자 핸드폰 번호',
    maximum: 11,
  })
  phone: string;
}
