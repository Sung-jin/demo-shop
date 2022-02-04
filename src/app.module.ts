import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import * as Joi from 'joi';
import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm';
import {User} from './users/domain/user.entity';
import {UsersModule} from './users/users.module';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';
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
        entities: [User],
        namingStrategy: new SnakeNamingStrategy(),
      } as TypeOrmModuleOptions),
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
