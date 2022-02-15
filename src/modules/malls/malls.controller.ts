import {Body, Controller, Post, Req, Res, UseGuards} from '@nestjs/common';
import {Request, Response} from 'express';
import {
    ApiBadRequestResponse, ApiBearerAuth,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport';
import {Mall} from '@/modules/malls/entities/mall.entity';
import {CreateMall} from '@/modules/malls/dto/createMall';
import {MallsService} from '@/modules/malls/malls.service';

@ApiBearerAuth()
@ApiTags('쇼핑몰 API')
@Controller('malls')
export class MallsController {
  constructor(
    private mallsService: MallsService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: '쇼핑몰 생성', description: '새로운 쇼핑몰을 생성한다' })
  @ApiCreatedResponse({ description: '쇼핑몰 생성 성공', type: Mall })
  @ApiBadRequestResponse({ description: '쇼핑몰 생성 실패' })
  @ApiUnauthorizedResponse({ description: '유효하지 않은 토큰 또는 만료' })
  async createMall(@Body() createMall: CreateMall, @Req() req: Request, @Res() res: Response) {
    const mall: Mall = await this.mallsService.create(createMall, req.user);

    return res.status(201).json(mall);
  }
}
