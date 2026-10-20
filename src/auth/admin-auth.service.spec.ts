import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminAuthService } from './admin-auth.service';
import { PrismaService } from '../prisma/prisma.service';

function makePrisma() {
  return {
    adminUser: {
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

const createAdminInput = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'password123',
};

const createdAdmin = {
  id: 'a1',
  name: 'Jane Doe',
  email: 'jane@example.com',
  passwordHash: 'hash',
  initials: 'JD',
};

describe('AdminAuthService.createAdmin', () => {
  it('rejects an email that already belongs to an admin', async () => {
    const prisma = makePrisma();
    (prisma.adminUser.findUnique as jest.Mock).mockResolvedValue(createdAdmin);
    const service = new AdminAuthService(prisma, makeJwt(), makeConfig());

    await expect(service.createAdmin(createAdminInput)).rejects.toThrow(
      ConflictException,
    );
  });

  it('returns the profile without a passwordHash or access token', async () => {
    const prisma = makePrisma();
    (prisma.adminUser.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.adminUser.create as jest.Mock).mockResolvedValue(createdAdmin);
    const service = new AdminAuthService(prisma, makeJwt(), makeConfig());

    const admin = await service.createAdmin(createAdminInput);

    expect(admin).toEqual({
      id: 'a1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      initials: 'JD',
    });
  });
});
