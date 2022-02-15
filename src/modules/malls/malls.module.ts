import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MallsController} from '@/modules/malls/malls.controller';
import {MallsRepository} from '@/modules/malls/malls.repository';
import {Mall} from '@/modules/malls/entities/mall.entity';
import {MallsService} from '@/modules/malls/malls.service';
import {UsersRepository} from '@/modules/users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Mall, MallsRepository, UsersRepository])],
  controllers: [MallsController],
  providers: [MallsService],
})
export class MallsModule {}
