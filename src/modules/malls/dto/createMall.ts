import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';

export class CreateMall {
  @ApiProperty({ description: '생성할 쇼핑몰 이름' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
