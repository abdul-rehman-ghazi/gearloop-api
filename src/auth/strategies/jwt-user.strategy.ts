import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

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
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_USER_SECRET'),
    });
  }

  // Re-checked on every request so suspending or deleting a user revokes
  // tokens that were issued before the change.
  async validate(payload: UserJwtPayload): Promise<UserAuthContext> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { deletedAt: true, isSuspended: true, emailVerifiedAt: true },
    });
    if (!user || user.deletedAt || user.isSuspended || !user.emailVerifiedAt) {
      throw new UnauthorizedException();
    }
    return {
      userId: payload.sub,
      email: payload.email,
      isOwner: payload.isOwner,
    };
  }
}
