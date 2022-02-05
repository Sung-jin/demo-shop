import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import {UsersRepository} from "./users.repository";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository
  ) {}

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findByLoginId(loginId: string): Promise<User | undefined> {
    return this.usersRepository.findOneByLoginId(loginId);
  }
}
