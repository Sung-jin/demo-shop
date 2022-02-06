import {forwardRef, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../modules/users/users.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../modules/users/entities/user.entity";
import {TokenResponse} from "./dto/tokenResponse.dto";
import {createCipheriv, randomBytes, scrypt} from "crypto";
import {promisify} from "util";
import {ConfigService} from "@nestjs/config";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, encryptPassword: string): Promise<any> {
    const user = await this.usersService.findByLoginId(username);

    if (!!user && bcrypt.compareSync(encryptPassword, user.password)) {
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

  async hashPassword(password): Promise<string> {
    return await bcrypt.hash(
      password,
      this.configService.get('encryption.hashSaltRound'),
    )
  }

  private async encryptionPassword(password: string): Promise<string> {
    const iv = randomBytes(16);
    const key = await promisify(scrypt)(
      this.configService.get('encryption.secretKey'),
      await bcrypt.genSalt(),
      this.configService.get('encryption.secretKeyLength'),
    ) as Buffer;
    const cipher = createCipheriv(this.configService.get('encryption.algorithm'), key, iv);

    return Buffer.concat([
      cipher.update(password),
      cipher.final()
    ]).toString();
  }
}
