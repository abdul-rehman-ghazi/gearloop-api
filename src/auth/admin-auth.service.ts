import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { computeInitials } from './utils/initials.util';
import { AdminJwtPayload } from './strategies/jwt-admin.strategy';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signup(dto: AdminSignupDto) {
    const existing = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException(
        'An admin account with this email already exists',
      );
    }

    const saltRounds = Number(this.config.get('BCRYPT_SALT_ROUNDS', 10));
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const admin = await this.prisma.adminUser.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        initials: computeInitials(dto.name),
      },
    });

    return {
      accessToken: this.signToken({
        sub: admin.id,
        email: admin.email,
        type: 'admin',
      }),
      admin: this.sanitize(admin),
    };
  }

  async login(dto: AdminLoginDto) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
    });
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(
      dto.password,
      admin.passwordHash,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    return {
      accessToken: this.signToken({
        sub: admin.id,
        email: admin.email,
        type: 'admin',
      }),
      admin: this.sanitize(admin),
    };
  }

  private signToken(payload: AdminJwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_ADMIN_SECRET'),
      expiresIn: this.config.get<string>('JWT_ADMIN_EXPIRES_IN', '1d') as never,
    });
  }

  private sanitize(admin: { passwordHash: string; [key: string]: unknown }) {
    const { passwordHash: _passwordHash, ...rest } = admin;
    return rest;
  }
}
