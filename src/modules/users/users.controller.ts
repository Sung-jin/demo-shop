import {Controller, Get, Param, Req, Res, UseGuards} from '@nestjs/common';
import {Request, Response} from 'express';
import {User} from './entities/user.entity';
import {UsersService} from './users.service';
import {ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";

@ApiBearerAuth()
@ApiTags('유저 API')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: '유저 조회', description: 'id 에 해당되는 유저를 조회한다' })
  @ApiOkResponse({ description: '유저 정보', type: User })
  @ApiUnauthorizedResponse({ description: '유효하지 않은 토큰 또는 만료' })
  async getUserById(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
    const user: User = await this.usersService.findOne(id);

    return res.status(200).json(user);
  }
}
