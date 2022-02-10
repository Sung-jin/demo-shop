import {forwardRef, Module} from '@nestjs/common';
import {AuthService} from '@/auth/auth.service';
import {UsersModule} from '@/modules/users/users.module';
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "@/auth/local.strategy";
import {AuthController} from "@/auth/auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {JwtStrategy} from "@/auth/jwt.strategy";

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, ConfigService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
