import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import * as Joi from 'joi';
import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm';
import {UsersModule} from './modules/users/users.module';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';
import {AuthModule} from './auth/auth.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.local',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('local', 'test', 'dev', 'prod').required(),
        DB_TYPE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
      }),
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get('type'),
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        database: configService.get('database.database'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
      } as TypeOrmModuleOptions),
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
