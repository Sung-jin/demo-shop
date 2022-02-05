import {ApiProperty} from "@nestjs/swagger";

export class TokenResponse {
  @ApiProperty({ description: 'jwt 토큰' })
  accessToken: string;
}