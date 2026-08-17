import { ExecutionContext } from '@nestjs/common';
import { UserAuthContext } from '../strategies/jwt-user.strategy';
declare const OptionalJwtUserAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class OptionalJwtUserAuthGuard extends OptionalJwtUserAuthGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
    handleRequest<TUser = UserAuthContext>(err: unknown, user: TUser | false): TUser | undefined;
}
export {};
