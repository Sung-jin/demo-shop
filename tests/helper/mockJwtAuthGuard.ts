import {ExecutionContext} from '@nestjs/common';

export default class MockJwtStrategy {
  constructor(private loginUser) {}
  // TODO - loginUser 가 실제 저장된 데이터가 아니면, 에러가 발생함. mock 데이터로 로그인 한 것 처럼 할 수 있는 더 좋은 방법을 찾아보자.
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.user = {
      username: this.loginUser.loginId,
    }

    return true;
  }
}
