import {UsersService} from '../users.service';
import {Test} from '@nestjs/testing';
import {v4 as uuidv4} from 'uuid';
import {UsersRepository} from '../users.repository';
import {AuthService} from '../../../auth/auth.service';
import {Register} from '../dto/register';
import {User} from '../entities/user.entity';
import {BadRequestException} from '@nestjs/common';

const userDB: User[] = [];

const mockUsersRepository = () => ({
  findOne: jest.fn().mockImplementation((condition: any) => {
    // TODO - 현재는 condition 1개로 찾고 있으니, 해당 형태로만 구현하고 더 좋은 형태가 있는지 알아보자
    // 개인적으로는 어차피 구현된 쿼리형태만 있으면 될 듯 한데, 확장성도 부족하고 테스트를 미리 작성할 수도 없으니 애매하다

    // findOne(id?: string | number | Date | ObjectID, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    // findOne(options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    // findOne(conditions?: FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;

    if (typeof condition in ['number' || 'string']) {
      return userDB.find(user => user.id === condition);
    } else {
      return userDB.find(user => {
        return Object.entries(condition).every(([condition, value]) => {
          return user.hasOwnProperty(condition) && user[condition] === value;
        });
      });
    }
  }),
  findOneByLoginId: jest.fn().mockImplementation((loginId: string) => {
    const findUsers = userDB.filter(user => user.loginId === loginId);

    if (findUsers.length > 1) fail('중복 저장된 Id 존재');
    // 현재는 탈퇴를 하였어도 같은 id 로 회원가입을 할 수 없음

    return findUsers[0];
  }),
  create: jest.fn().mockImplementation(() => new User()),
  save: jest.fn().mockImplementation((user: User) => {
    const findUser = userDB.find(db => db.id === user.id);

    if (findUser) {
      userDB.splice(userDB.map(user => user.id).indexOf(user.id), 1, user);
    } else {
      if (!!user.id) fail('저장전에 id 가 존재함');

      user.id = userDB.length + 1;
      userDB.push(user);
    }

    return user;
  }),
});

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
        { provide: UsersRepository, useValue: mockUsersRepository() },
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
      await expect(usersService.join(register)).rejects.toThrowError(new BadRequestException('이미 존재하는 사용자입니다.'));
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
