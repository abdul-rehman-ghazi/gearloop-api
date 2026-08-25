import { BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as geocoding from '../common/geocoding';

jest.mock('../common/geocoding');

afterEach(() => {
  jest.clearAllMocks();
});

function makePrisma() {
  return {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  } as unknown as PrismaService;
}

const baseUser = {
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
  address: null,
  lat: null,
  lng: null,
};

describe('UsersService.update', () => {
  it('geocodes and stores the address on success', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(baseUser);
    (geocoding.geocodeAddress as jest.Mock).mockResolvedValue({
      lat: -33.9249,
      lng: 18.4241,
    });
    (prisma.user.update as jest.Mock).mockResolvedValue({
      ...baseUser,
      address: '1 Long St, Cape Town',
      lat: -33.9249,
      lng: 18.4241,
    });

    const service = new UsersService(prisma);
    const result = await service.update('u1', {
      address: '1 Long St, Cape Town',
    });

    expect(geocoding.geocodeAddress).toHaveBeenCalledWith(
      '1 Long St, Cape Town',
    );
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          address: '1 Long St, Cape Town',
          lat: -33.9249,
          lng: 18.4241,
        }),
      }),
    );
    expect(result.address).toBe('1 Long St, Cape Town');
    expect(result).not.toHaveProperty('lat');
    expect(result).not.toHaveProperty('lng');
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('rejects the update when the address cannot be geocoded', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(baseUser);
    (geocoding.geocodeAddress as jest.Mock).mockResolvedValue(null);

    const service = new UsersService(prisma);

    await expect(service.update('u1', { address: 'nonsense' })).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('does not geocode when address is not part of the update', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(baseUser);
    (prisma.user.update as jest.Mock).mockResolvedValue(baseUser);

    const service = new UsersService(prisma);
    await service.update('u1', { name: 'New Name' });

    expect(geocoding.geocodeAddress).not.toHaveBeenCalled();
  });
});

describe('UsersService.findPublicProfile', () => {
  it('reports hasAddress true when lat/lng are set', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...baseUser,
      lat: -33.9249,
      lng: 18.4241,
    });

    const service = new UsersService(prisma);
    const profile = await service.findPublicProfile('u1');

    expect(profile.hasAddress).toBe(true);
    expect(profile).not.toHaveProperty('address');
    expect(profile).not.toHaveProperty('lat');
  });

  it('reports hasAddress false when lat/lng are null', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(baseUser);

    const service = new UsersService(prisma);
    const profile = await service.findPublicProfile('u1');

    expect(profile.hasAddress).toBe(false);
  });
});
