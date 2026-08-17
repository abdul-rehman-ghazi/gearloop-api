import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Only ever applies to routes protected by the 'jwt-user' strategy — never
// interchangeable with JwtAdminAuthGuard, since they verify against
// different secrets (JWT_USER_SECRET vs JWT_ADMIN_SECRET).
@Injectable()
export class JwtUserAuthGuard extends AuthGuard('jwt-user') {}
