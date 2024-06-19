import { AuthGuard } from '@nestjs/passport';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ERROR_CODES, ROLE_NAME } from 'src/constants';

const validateKindUser = (user, kind) => {
  if (!user) {
    throw new UnauthorizedException({
      message: ERROR_CODES.UNAUTHORIZED,
      statusCode: 401,
      error: ERROR_CODES.UNAUTHORIZED,
      login: false
    })
  }

  if (user && user.kind !== kind) {
    throw new ForbiddenException('USER_KIND_FORBIDDEN');
  }
};

export class CustomerGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  handleRequest(err, user, info, context) {
    validateKindUser(user, 'CUSTOMER');
    return super.handleRequest(err, user, info, context);
  }
}
export class AdminGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  handleRequest(err, user, info, context) {
    validateKindUser(user, ROLE_NAME.ADMIN);
    return super.handleRequest(err, user, info, context);
  }
}

export class SaleGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    validateKindUser(user, ROLE_NAME.SALE);
    return super.handleRequest(err, user, info, context);
  }
}

export class UserSignedGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (!user) {
      throw new UnauthorizedException({
        message: ERROR_CODES.UNAUTHORIZED,
        statusCode: 401,
        error: ERROR_CODES.UNAUTHORIZED,
        login: false
      })
    }
    return super.handleRequest(err, user, info, context);
  }
}

