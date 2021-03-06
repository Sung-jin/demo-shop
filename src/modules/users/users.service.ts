import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '@/modules/users/entities/user.entity';
import {UsersRepository} from "@/modules/users/users.repository";
import {Register} from "@/modules/users/dto/register";
import {AuthService} from '@/auth/auth.service';

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
    // TODO - user entity 랑 형태가 다른 req user 가 존재하는데, 같은 형태로 셋팅 할 수 있는 방법 또는 타입을 일치시킬 방법 찾아보기
    // const user = await this.findOne(reqUser.loginId);
    const user = await this.findByLoginId(reqUser.username);
    user.isWithdrawal = true;

    await this.usersRepository.save(user);
  }
}
