import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from '@/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException();
    } else if (user.isWithdrawal) {
      throw new BadRequestException('탈퇴한 회원입니다.');
    }

    return user;
  }
}
