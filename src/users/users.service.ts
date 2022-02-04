import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './domain/user.entity';
import {Repository} from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }
}
