import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { AdminAuthContext } from '../strategies/jwt-admin.strategy';

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AdminAuthContext => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: AdminAuthContext }>();
    return request.user;
  },
);
