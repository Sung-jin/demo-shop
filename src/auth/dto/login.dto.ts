import {ApiProperty} from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: '로그인 아이디' })
  readonly username: string;

  @ApiProperty({ description: '패스워드' })
  readonly password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
