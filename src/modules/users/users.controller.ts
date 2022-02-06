import {Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards} from '@nestjs/common';
import {Request, Response} from 'express';
import {User} from './entities/user.entity';
import {UsersService} from './users.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {Register} from "./dto/register";

@ApiTags('유저 API')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  @Post()
  @ApiOperation({ summary: '회원가입', description: '회원가입 요청한다' })
  @ApiCreatedResponse({ description: '회원 가입 성공', type: User })
  @ApiBadRequestResponse({ description: '회원 가입 실패', type: User })
  async createUser(@Body() register: Register, @Res() res: Response) {
    const user: User = await this.usersService.join(register);

    return res.status(201).json(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '유저 조회', description: 'id 에 해당되는 유저를 조회한다' })
  @ApiOkResponse({ description: '유저 정보', type: User })
  @ApiUnauthorizedResponse({ description: '유효하지 않은 토큰 또는 만료' })
  async getUserById(@Param('id') id: number, @Res() res: Response) {
    const user: User = await this.usersService.findOne(id);

    return res.status(200).json(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  @ApiBearerAuth()
  @ApiOperation({ summary: '회원 탈퇴', description: 'jwt 토큰을 바탕으로 회원 탈퇴를 진행한다' })
  @ApiOkResponse({ description: '탈퇴 성공' })
  @ApiUnauthorizedResponse({ description: '유효하지 않은 토큰 또는 만료' })
  async withdrawal(@Req() req: Request, @Res() res: Response) {
    await this.usersService.withdrawal(req.user);

    return res.status(200).json();
  }
}
