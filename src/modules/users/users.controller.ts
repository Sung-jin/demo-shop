import {Controller, Get, Param, Res} from '@nestjs/common';
import {Response} from 'express';
import {User} from './entities/user.entity';
import {UsersService} from './users.service';
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";

@Controller('users')
@ApiTags('유저 API')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  @Get(':id')
  @ApiOperation({ summary: '유저 조회', description: 'id 에 해당되는 유저를 조회한다' })
  @ApiOkResponse({ description: '유저 정보', type: User })
  async getUserById(@Param('id') id: number, @Res() res: Response) {
    const user: User = await this.usersService.findOne(id);

    return res.status(200).json(user);
  }
}
