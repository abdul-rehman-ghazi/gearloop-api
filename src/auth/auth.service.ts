import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { EmailVerificationService } from './email-verification.service';
import { computeInitials } from './utils/initials.util';
import { UserJwtPayload } from './strategies/jwt-user.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly emailVerification: EmailVerificationService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing && (existing.emailVerifiedAt || existing.deletedAt)) {
      throw new ConflictException('An account with this email already exists');
    }

    const saltRounds = Number(this.config.get('BCRYPT_SALT_ROUNDS', 10));
    const accountFields = {
      name: dto.name,
      passwordHash: await bcrypt.hash(dto.password, saltRounds),
      initials: computeInitials(dto.name),
    };

    // An unverified row has no proven owner, so the latest signup wins;
    // verifying the emailed code is what proves ownership.
    const user = existing
      ? await this.prisma.user.update({
          where: { id: existing.id },
          data: accountFields,
        })
      : await this.prisma.user.create({
          data: { email: dto.email, ...accountFields },
        });

    await this.emailVerification.sendCode({ id: user.id, email: user.email });
    return { email: user.email, verificationRequired: true };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.emailVerification.verify(dto);
    return this.issueSession(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || user.deletedAt || user.isSuspended) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    if (!user.emailVerifiedAt) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Email not verified',
        code: 'EMAIL_NOT_VERIFIED',
      });
    }

    return this.issueSession(user);
  }

  private issueSession(
    user: Parameters<AuthService['sanitize']>[0] & {
      id: string;
      email: string;
      isOwner: boolean;
    },
  ) {
    return {
      accessToken: this.signToken({
        sub: user.id,
        email: user.email,
        isOwner: user.isOwner,
      }),
      user: this.sanitize(user),
    };
  }

  private signToken(payload: UserJwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_USER_SECRET'),
      expiresIn: this.config.get<string>('JWT_USER_EXPIRES_IN', '1d') as never,
    });
  }

  private sanitize(user: {
    passwordHash: string;
    lat: unknown;
    lng: unknown;
    [key: string]: unknown;
  }) {
    const { passwordHash: _passwordHash, lat: _lat, lng: _lng, ...rest } = user;
    return rest;
  }
}
