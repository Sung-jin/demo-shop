import { Injectable } from '@nestjs/common';
import {UsersService} from "../modules/users/users.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByLoginId(username);

    if (!!user && user.password === password) {
      const { password, ...result } = user;
      return result;
    } else {
      return null;
    }
  }
}
