import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Verifies against JWT_ADMIN_SECRET via the 'jwt-admin' strategy. By
// convention this guard must only be applied to controllers whose route is
// prefixed `admin/...` — never reuse it to protect a non-admin route.
@Injectable()
export class JwtAdminAuthGuard extends AuthGuard('jwt-admin') {}
