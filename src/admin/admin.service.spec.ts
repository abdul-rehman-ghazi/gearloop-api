import { NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';

function makePrisma() {
  return {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    listing: {
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    booking: {
      updateMany: jest.fn(),
    },
    $transaction: jest.fn((ops: unknown[]) => Promise.all(ops)),
  } as unknown as PrismaService;
}

describe('AdminService.deleteListing', () => {
  it('soft-deletes the listing and its bookings instead of hard-deleting', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      id: 'l1',
      deletedAt: null,
    });

    const service = new AdminService(prisma);
    await service.deleteListing('l1');

    expect(prisma.booking.updateMany).toHaveBeenCalledWith({
      where: { listingId: 'l1' },
      data: { deletedAt: expect.any(Date) },
    });
    expect(prisma.listing.update).toHaveBeenCalledWith({
      where: { id: 'l1' },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it('404s on a listing that is already soft-deleted', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      id: 'l1',
      deletedAt: new Date(),
    });

    const service = new AdminService(prisma);
    await expect(service.deleteListing('l1')).rejects.toThrow(
      NotFoundException,
    );
  });
});
