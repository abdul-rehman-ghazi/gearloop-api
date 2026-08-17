import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
export interface AdminJwtPayload {
    sub: string;
    email: string;
    type: 'admin';
}
export interface AdminAuthContext {
    adminId: string;
    email: string;
}
declare const JwtAdminStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtAdminStrategy extends JwtAdminStrategy_base {
    constructor(config: ConfigService);
    validate(payload: AdminJwtPayload): AdminAuthContext;
}
export {};
