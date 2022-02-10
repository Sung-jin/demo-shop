import {Test} from '@nestjs/testing';
import {v4 as uuidv4} from 'uuid';
import {BadRequestException} from '@nestjs/common';
import mockRepository from '../common/mockRepository';
import {User} from '@/modules/users/entities/user.entity';
import {UsersService} from '@/modules/users/users.service';
import {UsersRepository} from '@/modules/users/users.repository';
import {AuthService} from '@/auth/auth.service';
import {Register} from '@/modules/users/dto/register';

class mockUsersRepository extends mockRepository<User> {
  findOneByLoginId(loginId: string) {
    const findUsers = this.mockDB.filter(user => user.loginId === loginId);

    if (findUsers.length > 1) fail('중복 저장된 id 존재');
    // 현재는 탈퇴를 하였어도 같은 id 로 회원가입을 할 수 없음

    return findUsers[0];
  }
}

const mockAuthService = () => ({
  hashPassword: jest.fn(),
});

describe('Users Service', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: new mockUsersRepository(User) },
        { provide: AuthService, useValue: mockAuthService() },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
  });

  describe('유저 조회', () => {
    it('유저 id 조회', async () => {
      // given
      const mockUser = new User();
      mockUser.loginId = 'demo-test1';
      const user = await usersRepository.save(mockUser);

      // when
      const findByIdUser = await usersService.findOne(mockUser.id);

      // then
      expect(user.id).toBeDefined();
      expect(user.id).toEqual(findByIdUser.id);
    })

    it('유저 loginId 조회', async () => {
      // given
      const mockUser = new User();
      mockUser.loginId = 'demo-test2';
      const user = await usersRepository.save(mockUser);

      // when
      const findByIdUser = await usersService.findByLoginId(mockUser.loginId);

      // then
      expect(user.id).toBeDefined();
      expect(user.id).toEqual(findByIdUser.id);
      expect(user.loginId).toEqual(findByIdUser.loginId);
    });
  });

  describe('유저 생성', () => {
    it('중복된 계정이 없으면 정상 생성된다', async () => {
      // given
      const register = new Register();
      register.loginId = uuidv4();
      register.password = 'password';
      register.email = 'test@demo.com';
      register.phone = '01000000000';

      // when
      const joinUser = await usersService.join(register);
      const user = await usersService.findByLoginId(register.loginId);

      // then
      expect(joinUser.id).toBeDefined();
      expect(joinUser.id).toBe(user.id);
    });

    it('중복된 유저 생성 시 예외가 발생한다', async () => {
      // given
      const register = new Register();
      register.loginId = uuidv4();
      register.password = 'password';
      register.email = 'test@demo.com';
      register.phone = '01000000000';

      // when
      await usersService.join(register);

      // then
      await expect(usersService.join(register))
          .rejects
          .toThrowError(new BadRequestException('이미 존재하는 사용자입니다.'));
    });
  });

  it('회원 탈퇴', async () => {
    // given
    const mockUser = new User();
    mockUser.loginId = 'demo-test3';
    const user = await usersRepository.save(mockUser);

    // when
    await usersService.withdrawal({userId: user.id});
    const withdrawalUser = await usersService.findOne(user.id);

    // then
    expect(withdrawalUser.id).toBeDefined();
    expect(withdrawalUser.isWithdrawal).toBeTruthy();
  });
})
