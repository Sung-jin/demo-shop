import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {Request} from 'express';
import {ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {AuthService} from "./auth.service";
import {User} from "../modules/users/entities/user.entity";
import {TokenResponse} from "./dto/tokenResponse.dto";
import {LoginDto} from "./dto/login.dto";

@Controller('auth')
@ApiTags('권한 API')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: '로그인', description: 'id 와 password 로 로그인을 한다' })
  @ApiCreatedResponse({ description: 'jwt 토큰 정보', type: TokenResponse })
  @ApiUnauthorizedResponse({ description: '로그인 실패' })
  async login(@Req() req: Request, @Body() loginDto: LoginDto): Promise<TokenResponse> {
    return this.authService.login(req.user as User);
  }
}
