import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_USER_SECRET'),
    });
  }

  validate(payload: UserJwtPayload): UserAuthContext {
    return {
      userId: payload.sub,
      email: payload.email,
      isOwner: payload.isOwner,
    };
  }
}
