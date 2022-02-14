import {Test, TestingModule} from '@nestjs/testing';
import {v4 as uuidv4} from 'uuid';
import * as request from 'supertest';
import {HttpStatus, INestApplication} from '@nestjs/common';
import {Register} from '@/modules/users/dto/register';
import {UsersModule} from '@/modules/users/users.module';
import {AppModule} from '@/app.module';
import {UsersRepository} from '@/modules/users/users.repository';
import {LoginDto} from '@/auth/dto/login.dto';
import MockJwtStrategy from '#/helper/mockJwtAuthGuard';
import {AuthGuard} from '@nestjs/passport';

describe('Users Controller (e2e)', () => {
  let app: INestApplication;
  let usersRepository;
  let req;
  const generateMockRegister = () => {
    const register = new Register();
    register.loginId = uuidv4();
    register.password = 'password';
    register.email = 'test@demo.com';
    register.phone = '01000000000';

    return register;
  }
  const loginUser = generateMockRegister();

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
    }).overrideGuard(AuthGuard('jwt'))
        .useValue(new MockJwtStrategy(loginUser))
        .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    req = request(app.getHttpServer());

    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
    await req.post('/users')
        .send(loginUser);
  });

  describe('유저 생성', () => {
    describe('/users (POST)', () => {
      it('중복된 계정이 없으면 정상 생성 응답이 온다', () => {
        return req.post('/users')
            .send(generateMockRegister())
            .expect(HttpStatus.CREATED)
            .then(res => {
              expect(res.body).toBeDefined();
              expect(res.body.id).toBeDefined();
            });
      });

      it('중복된 유저 생성 요청 시 BadRequest 응답이 온다', async () => {
        const register: Register = generateMockRegister();

        return req.post('/users')
            .send(register)
            .then(res => {
              expect(res.status).toBe(HttpStatus.CREATED);

              return req.post('/users')
                .send(register)
                .expect(HttpStatus.BAD_REQUEST);
            });
        });
    });
  });

  describe('회원탈퇴', () => {
    it('회원 탈퇴 후 해당 계정으로 로그인은 불가능하다', () => {
      // const loginDto = new LoginDto(loginUser.loginId, loginUser.password);
      return req.delete('/users')
          .then(async (res) => {
            const withdrawalUser = await usersRepository.findOneByLoginId(loginUser.loginId);
            expect(withdrawalUser.isWithdrawal).toBeTruthy();

            return req.post('/auth/login')
                .send(new LoginDto(loginUser.loginId, loginUser.password))
                .expect(HttpStatus.BAD_REQUEST);
          })
    })
  })
});
