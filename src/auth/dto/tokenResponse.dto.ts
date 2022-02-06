import {ApiProperty} from "@nestjs/swagger";

export class TokenResponse {
  @ApiProperty({ description: 'jwt 토큰' })
  accessToken: string;

  @ApiProperty({ description: 'jwt 토큰 만료시간' })
  accessMaxAge: Date;

  @ApiProperty({ description: 'jwt refresh 토큰' })
  refreshToken: string;

  @ApiProperty({ description: 'jwt refresh 토큰 만료시간' })
  refreshMaxAge: Date;
}