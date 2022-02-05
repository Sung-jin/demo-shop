import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UsersModule} from "../modules/users/users.module";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./local.strategy";
import {AuthController} from "./auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigService,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.privateKey'),
        algorithm: 'RS256',
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      })
    }),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
