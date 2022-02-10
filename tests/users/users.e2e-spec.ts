import {Test, TestingModule} from '@nestjs/testing';
import {v4 as uuidv4} from 'uuid';
import * as request from 'supertest';
import {HttpStatus, INestApplication} from '@nestjs/common';
import {Register} from '@/modules/users/dto/register';
import {UsersModule} from '@/modules/users/users.module';
import {AppModule} from '@/app.module';

describe('Users Controller (e2e)', () => {
  let app: INestApplication;
  const generateMockRegister = () => {
    const register = new Register();
    register.loginId = uuidv4();
    register.password = 'password';
    register.email = 'test@demo.com';
    register.phone = '01000000000';

    return register;
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('유저 생성', () => {
    describe('/users (POST)', () => {
      it('중복된 계정이 없으면 정상 생성 응답이 온다', () => {
        return request(app.getHttpServer())
            .post('/users')
            .send(generateMockRegister())
            .expect(HttpStatus.CREATED)
            .then(res => {
              expect(res.body).toBeDefined();
              expect(res.body.id).toBeDefined();
            });
      });

      it('중복된 유저 생성 요청 시 BadRequest 응답이 온다', async () => {
        const register: Register = generateMockRegister();

        return request(app.getHttpServer())
            .post('/users')
            .send(register)
            .then((res) => {
              expect(res.status).toBe(HttpStatus.CREATED);

              return request(app.getHttpServer())
                .post('/users')
                .send(register)
                .expect(HttpStatus.BAD_REQUEST);
            });
        });
    });
  });
});
