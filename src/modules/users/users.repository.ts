import {User} from './entities/user.entity';
import {EntityRepository, Repository} from "typeorm";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async findOneByLoginId(loginId: string): Promise<User|undefined> {
    const userLoginId = loginId.trim();

    return await this.findOne({ loginId: userLoginId });
  }
}
