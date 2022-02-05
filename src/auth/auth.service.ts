import {Injectable} from '@nestjs/common';
import {UsersService} from "../modules/users/users.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../modules/users/entities/user.entity";
import {TokenResponse} from "./dto/tokenResponse.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByLoginId(username);

    if (!!user && user.password === password) {
      const { password, ...result } = user;
      return result;
    } else {
      return null;
    }
  }

  login(user: User): TokenResponse {
    const payload = { username: user.loginId, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload)
    }
  }
}
