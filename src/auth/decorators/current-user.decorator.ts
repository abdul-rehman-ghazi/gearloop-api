import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAuthContext } from '../strategies/jwt-user.strategy';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserAuthContext | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
