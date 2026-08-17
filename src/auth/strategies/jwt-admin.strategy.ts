import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface AdminJwtPayload {
  sub: string;
  email: string;
  type: 'admin';
}

export interface AdminAuthContext {
  adminId: string;
  email: string;
}

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ADMIN_SECRET'),
    });
  }

  validate(payload: AdminJwtPayload): AdminAuthContext {
    return {
      adminId: payload.sub,
      email: payload.email,
    };
  }
}
