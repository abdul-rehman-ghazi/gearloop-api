import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

function makePrisma() {
  return {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
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
  address: '1 Long St, Cape Town',
  lat: -33.9249,
  lng: 18.4241,
};

describe('AuthService.signup', () => {
  it('never returns lat/lng or passwordHash on the created user', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);

    const service = new AuthService(prisma, makeJwt(), makeConfig());
    const result = await service.signup({
      name: 'Renter One',
      email: 'renter@example.com',
      password: 'password123',
    });

    expect(result.user).not.toHaveProperty('lat');
    expect(result.user).not.toHaveProperty('lng');
    expect(result.user).not.toHaveProperty('passwordHash');
    expect((result.user as { address: string }).address).toBe(
      '1 Long St, Cape Town',
    );
  });
});
