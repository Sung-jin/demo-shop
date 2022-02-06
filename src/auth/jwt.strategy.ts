import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {ExtractJwt, Strategy} from "passport-jwt";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.privateKey'),
    });
  }

  async validate(payload) {
    return { userId: payload.sub, username: payload.username };
  }
}
