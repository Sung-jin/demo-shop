import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {Request} from 'express';
import {ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {AuthService} from "./auth.service";
import {User} from '@/modules/users/entities/user.entity';
import {TokenResponse} from '@/auth/dto/tokenResponse.dto';
import {LoginDto} from "@/auth/dto/login.dto";

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

  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: '재발급', description: 'jwt refresh 토큰으로 재발급을 요청한다' })
  @ApiCreatedResponse({ description: 'jwt 토큰 정보', type: TokenResponse })
  @ApiUnauthorizedResponse({ description: '토큰 갱신 실패' })
  async refreshToken(@Req() req: Request): Promise<TokenResponse> {
    return this.authService.refreshToken(req.header('Authorization')?.replace('Bearer ', '') || '');
  }
}
