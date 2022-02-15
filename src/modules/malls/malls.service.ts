import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UsersRepository} from '@/modules/users/users.repository';
import {MallsRepository} from '@/modules/malls/malls.repository';
import {Mall} from '@/modules/malls/entities/mall.entity';
import {CreateMall} from '@/modules/malls/dto/createMall';

@Injectable()
export class MallsService {
  constructor(
    @InjectRepository(MallsRepository)
    private mallsRepository: MallsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async create(createMall: CreateMall, reqUser): Promise<Mall> {
    const mall = this.mallsRepository.create();
    mall.owner = await this.usersRepository.findOne(reqUser.userId || 0);

    return this.mallsRepository.save(
      Object.assign(mall, createMall)
    );
  }
}
