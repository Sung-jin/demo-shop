import {forwardRef, Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersRepository} from "./users.repository";
import {User} from "./entities/user.entity";
import {AuthModule} from "../../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UsersRepository]),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
