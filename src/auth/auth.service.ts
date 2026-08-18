import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { computeInitials } from './utils/initials.util';
import { UserJwtPayload } from './strategies/jwt-user.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const saltRounds = Number(this.config.get('BCRYPT_SALT_ROUNDS', 10));
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        initials: computeInitials(dto.name),
      },
    });

    return {
      accessToken: this.signToken({
        sub: user.id,
        email: user.email,
        isOwner: user.isOwner,
      }),
      user: this.sanitize(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

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

  private sanitize(user: { passwordHash: string; [key: string]: unknown }) {
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
  }
}
