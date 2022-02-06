import {Body, Controller, Get, Param, Post, Res, UseGuards} from '@nestjs/common';
import {Response} from 'express';
import {User} from './entities/user.entity';
import {UsersService} from './users.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {Register} from "./dto/register";

@ApiBearerAuth()
@ApiTags('유저 API')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  @Post()
  @ApiOperation({ summary: '회원가입', description: '회원가입 요청한다' })
  @ApiCreatedResponse({ description: '회원 가입 성공', type: User })
  async createUser(@Body() register: Register, @Res() res: Response) {
    const user: User = await this.usersService.join(register);

    return res.status(201).json(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: '유저 조회', description: 'id 에 해당되는 유저를 조회한다' })
  @ApiOkResponse({ description: '유저 정보', type: User })
  @ApiUnauthorizedResponse({ description: '유효하지 않은 토큰 또는 만료' })
  async getUserById(@Param('id') id: number, @Res() res: Response) {
    const user: User = await this.usersService.findOne(id);

    return res.status(200).json(user);
  }
}
