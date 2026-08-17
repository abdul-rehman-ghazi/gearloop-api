import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthContext } from '../strategies/jwt-user.strategy';

// Same 'jwt-user' strategy, but never throws: an absent or invalid token
// simply leaves request.user undefined instead of rejecting the request.
// Used on endpoints that behave differently for authenticated callers
// (e.g. GET /listings including the caller's own non-active listings)
// without requiring a token to be present at all.
@Injectable()
export class OptionalJwtUserAuthGuard extends AuthGuard('jwt-user') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest<TUser = UserAuthContext>(
    err: unknown,
    user: TUser | false,
  ): TUser | undefined {
    if (err || !user) return undefined;
    return user;
  }
}
