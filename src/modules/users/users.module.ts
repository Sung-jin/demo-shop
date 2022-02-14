import {forwardRef, Module} from '@nestjs/common';
import {UsersService} from '@/modules/users/users.service';
import {UsersController} from '@/modules/users/users.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersRepository} from "@/modules/users/users.repository";
import {User} from "@/modules/users/entities/user.entity";
import {AuthModule} from '@/auth/auth.module';

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
