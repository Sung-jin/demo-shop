import {Body, Controller, Post, Res, UseGuards} from '@nestjs/common';
import {Response} from 'express';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {LoginDto} from "../modules/users/dto/login.dto";
import {AuthGuard} from "@nestjs/passport";

@Controller('auth')
@ApiTags('권한 API')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: '로그인', description: 'id 와 password 로 로그인을 한다' })
  // @ApiOkResponse({ description: 'jwt 토큰 정보', type: {token, value} })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return res.status(200).json(loginDto);
  }
}
