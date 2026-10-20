import {
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { EmailVerificationService } from './email-verification.service';
import { PrismaService } from '../prisma/prisma.service';

function makePrisma() {
  return {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  } as unknown as PrismaService;
}

function makeJwt() {
  return { sign: jest.fn().mockReturnValue('token') } as unknown as JwtService;
}

function makeConfig() {
  return {
    get: jest.fn((_key: string, fallback?: unknown) => fallback),
    getOrThrow: jest.fn().mockReturnValue('secret'),
  } as unknown as ConfigService;
}

function makeVerification() {
  return {
    sendCode: jest.fn().mockResolvedValue(undefined),
    verify: jest.fn(),
  } as unknown as EmailVerificationService;
}

function makeService(
  prisma: PrismaService,
  verification: EmailVerificationService = makeVerification(),
) {
  return new AuthService(prisma, makeJwt(), makeConfig(), verification);
}

const signupInput = {
  name: 'Renter One',
  email: 'renter@example.com',
  password: 'password123',
};

const createdUser = {
  id: 'u1',
  name: 'Renter One',
  email: 'renter@example.com',
  passwordHash: 'hash',
  initials: 'RO',
  isOwner: false,
  isSuspended: false,
  memberSince: new Date('2026-01-01'),
  responseTime: null,
  deletedAt: null,
  emailVerifiedAt: new Date('2026-01-02'),
  address: '1 Long St, Cape Town',
  lat: -33.9249,
  lng: 18.4241,
};

describe('AuthService.signup', () => {
  it('creates_an_unverified_user_and_sends_a_code_without_returning_a_token', async () => {
    const prisma = makePrisma();
    const verification = makeVerification();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      ...createdUser,
      emailVerifiedAt: null,
    });

    const result = await makeService(prisma, verification).signup(signupInput);

    expect(result).toEqual({
      email: 'renter@example.com',
      verificationRequired: true,
    });
    expect(verification.sendCode).toHaveBeenCalledWith({
      id: 'u1',
      email: 'renter@example.com',
    });
  });

  it('replaces_name_and_password_of_an_unverified_account_and_resends', async () => {
    const prisma = makePrisma();
    const verification = makeVerification();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...createdUser,
      emailVerifiedAt: null,
    });
    (prisma.user.update as jest.Mock).mockResolvedValue({
      ...createdUser,
      emailVerifiedAt: null,
    });

    await makeService(prisma, verification).signup(signupInput);

    const [{ data }] = (prisma.user.update as jest.Mock).mock.calls[0] as [
      { data: { name: string; initials: string; passwordHash: string } },
    ];
    expect(data.name).toBe('Renter One');
    expect(data.initials).toBe('RO');
    expect(await bcrypt.compare('password123', data.passwordHash)).toBe(true);
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(verification.sendCode).toHaveBeenCalledTimes(1);
  });

  it('rejects_signup_over_a_verified_account_with_conflict', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(createdUser);

    await expect(makeService(prisma).signup(signupInput)).rejects.toThrow(
      ConflictException,
    );
  });

  it('rejects_signup_over_a_deleted_unverified_account_with_conflict', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...createdUser,
      emailVerifiedAt: null,
      deletedAt: new Date(),
    });

    await expect(makeService(prisma).signup(signupInput)).rejects.toThrow(
      ConflictException,
    );
  });
});

describe('AuthService.verifyEmail', () => {
  it('returns_a_token_and_sanitized_user_when_the_code_is_correct', async () => {
    const verification = makeVerification();
    (verification.verify as jest.Mock).mockResolvedValue(createdUser);

    const result = await makeService(makePrisma(), verification).verifyEmail({
      email: 'renter@example.com',
      code: '123456',
    });

    expect(result.accessToken).toBe('token');
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(result.user).not.toHaveProperty('lat');
    expect((result.user as { address: string }).address).toBe(
      '1 Long St, Cape Town',
    );
  });
});

describe('AuthService.login', () => {
  async function userWithPassword(overrides: object = {}) {
    return {
      ...createdUser,
      passwordHash: await bcrypt.hash('password123', 4),
      ...overrides,
    };
  }

  it('rejects_a_suspended_user_with_valid_credentials', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(
      await userWithPassword({ isSuspended: true }),
    );

    await expect(
      makeService(prisma).login({
        email: 'renter@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects_an_unverified_user_with_email_not_verified_code', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(
      await userWithPassword({ emailVerifiedAt: null }),
    );

    const attempt = makeService(prisma).login({
      email: 'renter@example.com',
      password: 'password123',
    });

    await expect(attempt).rejects.toThrow(ForbiddenException);
    await expect(attempt).rejects.toMatchObject({
      response: {
        statusCode: 403,
        message: 'Email not verified',
        code: 'EMAIL_NOT_VERIFIED',
      },
    });
  });

  it('checks_the_password_before_revealing_unverified_status', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(
      await userWithPassword({ emailVerifiedAt: null }),
    );

    await expect(
      makeService(prisma).login({
        email: 'renter@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
