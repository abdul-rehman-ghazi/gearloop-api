import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { UserAuthContext } from '../strategies/jwt-user.strategy';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserAuthContext | undefined => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: UserAuthContext }>();
    return request.user;
  },
);
