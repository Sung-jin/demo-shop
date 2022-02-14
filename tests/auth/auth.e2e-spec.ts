import {Test, TestingModule} from '@nestjs/testing';
import {v4 as uuidv4} from 'uuid';
import * as request from 'supertest';
import {HttpStatus, INestApplication} from '@nestjs/common';
import {Register} from '@/modules/users/dto/register';
import {UsersModule} from '@/modules/users/users.module';
import {AppModule} from '@/app.module';
import {AuthModule} from '@/auth/auth.module';
import {LoginDto} from '@/auth/dto/login.dto';

const generateMockRegister = () => {
    const register = new Register();
    register.loginId = uuidv4();
    register.password = 'password';
    register.email = 'test@demo.com';
    register.phone = '01000000000';

    return register;
}

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;
  let req;
  const mockUser = generateMockRegister();
  const loginDto: LoginDto = new LoginDto(mockUser.loginId, mockUser.password);
  const wrongLoginDto: LoginDto = new LoginDto(mockUser.loginId + '1', mockUser.password + '1');

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
      req = request(app.getHttpServer());

    await req.post('/users')
        .send(mockUser);
  });

  describe('접근 권한', () => {
    describe('/auth (GET)', () => {
      it('정상 로그인 시 토큰이 발급된다', async () => {
        return req.post('/auth/login')
            .send(loginDto)
            .then(res => {
              expect(res.statusCode).toBe(HttpStatus.CREATED);
              expect(res.body).toHaveProperty('accessToken');
              expect(res.body).toHaveProperty('refreshToken');
              expect(res.body).toHaveProperty('accessMaxAge');
              expect(res.body).toHaveProperty('refreshMaxAge');
            });
      });

      it('로그인 실패 시 토큰 발급이 실패한다', () => {
        return req.post('/auth/login')
            .send(wrongLoginDto)
            .expect(HttpStatus.UNAUTHORIZED);
        });

      it('정상 refresh 토큰으로 토큰 재요청 시 새로운 토큰이 발급된다', () => {
        return req.post('/auth/login')
            .send(loginDto)
            .then(res => {
              const token = res.body.accessToken;
              const refreshToken = res.body.refreshToken;

              setTimeout(() => {
                return req.post('/auth/refresh')
                    .auth(refreshToken, { type: 'bearer' })
                    .then(res => {
                      expect(res.statusCode).toBe(HttpStatus.CREATED);
                      expect(res.body.accessToken).not.toBe(token);
                      expect(res.body.refreshToken).not.toBe(refreshToken);
                    });
              }, 1000);
            });
      })

      it('비정상 refresh 토큰으로 토큰 재요청 시 토큰 재발급이 실패된다', () => {
        return req.post('/auth/login')
            .send(loginDto)
            .then(res => {
              const refreshToken = res.body.refreshToken;

              return req.post('/auth/refresh')
                  .auth(refreshToken + '1', { type: 'bearer' })
                  .then(res => {
                    expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
                  });
            });
      });
    });

    describe('토큰이 필요한 api 호출', () => {
      it('비정상 토큰으로 요청 시 401 응답이 온다', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .then(res => {
              const token = res.body.accessToken;

              return req.delete('/users')
                  .auth(token + '1', { type: 'bearer' })
                  .then(res => {
                    expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
                  });
            });
      });

      it('토큰 없이 요청 시 401 응답이 온다', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .then(res => {
              const token = res.body.accessToken;

              return req.delete('/users')
                  .then(res => {
                    expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
                  });
            });
      });

      it('정상 토큰으로 요청 시 정상 응답이 온다', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .then(res => {
              const token = res.body.accessToken;

              return req.delete('/users')
                  .auth(token, { type: 'bearer' })
                  .then(res => {
                      expect(res.statusCode).toBe(HttpStatus.OK);
                  });
            });
      });
    });
  });
});
