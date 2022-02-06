import {BadRequestException, Injectable} from '@nestjs/common';
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

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async findByLoginId(loginId: string): Promise<User | undefined> {
    return await this.usersRepository.findOneByLoginId(loginId);
  }

  async join(register: Register): Promise<User> {
    if ((await this.usersRepository.findOneByLoginId(register.loginId))?.id) throw new BadRequestException('이미 존재하는 사용자입니다.');
    // TODO - 예외 정의 필요

    const user = this.usersRepository.create();
    register.password = await this.authService.hashPassword(register.password);

    return this.usersRepository.save(
      Object.assign(user, register)
    );
  }

  async withdrawal(reqUser) {
    const user = await this.findOne(reqUser.userId);
    user.isWithdrawal = true;

    await this.usersRepository.save(user);
  }
}
