import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtUserStrategy, UserJwtPayload } from './jwt-user.strategy';
import { PrismaService } from '../../prisma/prisma.service';

function makePrisma() {
  return {
    user: { findUnique: jest.fn() },
  } as unknown as PrismaService;
}

function makeConfig() {
  return {
    getOrThrow: jest.fn().mockReturnValue('secret'),
  } as unknown as ConfigService;
}

const payload: UserJwtPayload = {
  sub: 'u1',
  email: 'renter@example.com',
  isOwner: false,
};

describe('JwtUserStrategy.validate', () => {
  it('returns_the_auth_context_for_an_active_user', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      deletedAt: null,
      isSuspended: false,
      emailVerifiedAt: new Date(),
    });

    const strategy = new JwtUserStrategy(makeConfig(), prisma);

    await expect(strategy.validate(payload)).resolves.toEqual({
      userId: 'u1',
      email: 'renter@example.com',
      isOwner: false,
    });
  });

  it.each([
    ['missing', null],
    [
      'soft_deleted',
      {
        deletedAt: new Date(),
        isSuspended: false,
        emailVerifiedAt: new Date(),
      },
    ],
    [
      'suspended',
      { deletedAt: null, isSuspended: true, emailVerifiedAt: new Date() },
    ],
    [
      'unverified',
      { deletedAt: null, isSuspended: false, emailVerifiedAt: null },
    ],
  ])('rejects_a_%s_user', async (_label, user) => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

    const strategy = new JwtUserStrategy(makeConfig(), prisma);

    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
