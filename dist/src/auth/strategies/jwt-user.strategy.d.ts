import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
export interface UserJwtPayload {
    sub: string;
    email: string;
    isOwner: boolean;
}
export interface UserAuthContext {
    userId: string;
    email: string;
    isOwner: boolean;
}
declare const JwtUserStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtUserStrategy extends JwtUserStrategy_base {
    constructor(config: ConfigService);
    validate(payload: UserJwtPayload): UserAuthContext;
}
export {};
