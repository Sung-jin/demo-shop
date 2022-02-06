import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import {UsersRepository} from "./users.repository";
import {Register} from "./dto/register";
import {AuthService} from "../../auth/auth.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private authService: AuthService,
  ) {}

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findByLoginId(loginId: string): Promise<User | undefined> {
    return this.usersRepository.findOneByLoginId(loginId);
  }

  async join(register: Register): Promise<User> {
    const user = this.usersRepository.create();
    register.password = await this.authService.hashPassword(register.password);

    return this.usersRepository.save(
      Object.assign(user, register)
    );
  }
}
