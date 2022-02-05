import {Controller, Get} from '@nestjs/common';
import {User} from './entities/user.entity';
import {UsersService} from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  @Get(':id')
  getHello(id: number): Promise<User> {
    return this.usersService.findOne(id);
  }
}
