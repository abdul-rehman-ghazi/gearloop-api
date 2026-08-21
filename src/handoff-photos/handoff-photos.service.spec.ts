import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { HandoffPhotosService } from './handoff-photos.service';
import { PrismaService } from '../prisma/prisma.service';

function makePrisma() {
  return {
    booking: {
      findUnique: jest.fn(),
    },
    handoffPhoto: {
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn().mockResolvedValue(0),
    },
  } as unknown as PrismaService;
}

const confirmedBooking = {
  id: 'b1',
  status: 'confirmed',
  renterId: 'renter-1',
  listingId: 'l1',
  listing: { id: 'l1', ownerId: 'owner-1' },
};

describe('HandoffPhotosService.create', () => {
  function arrange(bookingOverrides: Record<string, unknown> = {}) {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue({
      ...confirmedBooking,
      ...bookingOverrides,
    });
    (prisma.handoffPhoto.create as jest.Mock).mockResolvedValue({ id: 'p1' });
    return prisma;
  }

  it('records a pickup photo for the renter on a confirmed booking', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    const result = await service.create('renter-1', 'b1', {
      stage: 'pickup',
      url: 'https://cdn.example.com/a.jpg',
      note: 'Small scuff on the barrel',
    });

    expect(prisma.handoffPhoto.create).toHaveBeenCalledWith({
      data: {
        bookingId: 'b1',
        uploaderId: 'renter-1',
        stage: 'pickup',
        url: 'https://cdn.example.com/a.jpg',
        note: 'Small scuff on the barrel',
      },
    });
    expect(result).toEqual({ id: 'p1' });
  });

  it('records a pickup photo for the owner too', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    await service.create('owner-1', 'b1', {
      stage: 'pickup',
      url: 'https://cdn.example.com/b.jpg',
    });

    expect(prisma.handoffPhoto.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ uploaderId: 'owner-1' }),
    });
  });

  it('never writes a client-supplied timestamp or uploader', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    await service.create('renter-1', 'b1', {
      stage: 'pickup',
      url: 'https://cdn.example.com/a.jpg',
      // Anything extra a client smuggles in must not reach the row.
      ...({
        createdAt: '2020-01-01T00:00:00Z',
        uploaderId: 'owner-1',
      } as object),
    });

    const calls = (prisma.handoffPhoto.create as jest.Mock).mock
      .calls as unknown as Array<
      [{ data: { createdAt?: unknown; uploaderId: string } }]
    >;
    const { data } = calls[0][0];
    expect(data.createdAt).toBeUndefined();
    expect(data.uploaderId).toBe('renter-1');
  });

  it('rejects a photo from someone who is not a party to the booking', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    await expect(
      service.create('stranger-1', 'b1', {
        stage: 'pickup',
        url: 'https://cdn.example.com/a.jpg',
      }),
    ).rejects.toThrow('You are not a party to this booking');

    expect(prisma.handoffPhoto.create).not.toHaveBeenCalled();
  });

  it('rejects a photo on a booking that does not exist', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(null);

    const service = new HandoffPhotosService(prisma);
    await expect(
      service.create('renter-1', 'nope', {
        stage: 'pickup',
        url: 'https://cdn.example.com/a.jpg',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('rejects pickup photos on a pending booking', async () => {
    const prisma = arrange({ status: 'pending' });

    const service = new HandoffPhotosService(prisma);
    await expect(
      service.create('renter-1', 'b1', {
        stage: 'pickup',
        url: 'https://cdn.example.com/a.jpg',
      }),
    ).rejects.toThrow(
      'Pickup photos can only be added while the booking is confirmed',
    );
  });

  it('rejects pickup photos once the booking is completed', async () => {
    const prisma = arrange({ status: 'completed' });

    const service = new HandoffPhotosService(prisma);
    await expect(
      service.create('owner-1', 'b1', {
        stage: 'pickup',
        url: 'https://cdn.example.com/a.jpg',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('accepts return photos on a confirmed booking', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    await service.create('owner-1', 'b1', {
      stage: 'returned',
      url: 'https://cdn.example.com/c.jpg',
    });

    expect(prisma.handoffPhoto.create).toHaveBeenCalled();
  });

  it('still accepts return photos just after the owner completes the booking', async () => {
    const prisma = arrange({ status: 'completed' });

    const service = new HandoffPhotosService(prisma);
    await service.create('renter-1', 'b1', {
      stage: 'returned',
      url: 'https://cdn.example.com/d.jpg',
    });

    expect(prisma.handoffPhoto.create).toHaveBeenCalled();
  });

  it('rejects return photos on a cancelled booking', async () => {
    const prisma = arrange({ status: 'cancelled' });

    const service = new HandoffPhotosService(prisma);
    await expect(
      service.create('renter-1', 'b1', {
        stage: 'returned',
        url: 'https://cdn.example.com/d.jpg',
      }),
    ).rejects.toThrow(
      'Return photos can only be added once the booking is confirmed',
    );
  });

  it('caps a party at 20 photos per stage', async () => {
    const prisma = arrange();
    (prisma.handoffPhoto.count as jest.Mock).mockResolvedValue(20);

    const service = new HandoffPhotosService(prisma);
    await expect(
      service.create('renter-1', 'b1', {
        stage: 'pickup',
        url: 'https://cdn.example.com/a.jpg',
      }),
    ).rejects.toThrow('Photo limit reached for this handoff');

    expect(prisma.handoffPhoto.count).toHaveBeenCalledWith({
      where: { bookingId: 'b1', uploaderId: 'renter-1', stage: 'pickup' },
    });
    expect(prisma.handoffPhoto.create).not.toHaveBeenCalled();
  });

  it('counts each party and stage separately against the cap', async () => {
    const prisma = arrange();
    (prisma.handoffPhoto.count as jest.Mock).mockResolvedValue(19);

    const service = new HandoffPhotosService(prisma);
    await service.create('renter-1', 'b1', {
      stage: 'pickup',
      url: 'https://cdn.example.com/a.jpg',
    });

    expect(prisma.handoffPhoto.create).toHaveBeenCalled();
  });
});

describe('HandoffPhotosService.findForBooking', () => {
  const rows = [
    {
      id: 'p1',
      stage: 'pickup',
      url: 'https://cdn.example.com/a.jpg',
      uploaderId: 'renter-1',
      createdAt: new Date('2026-09-01T09:00:00Z'),
    },
    {
      id: 'p2',
      stage: 'returned',
      url: 'https://cdn.example.com/b.jpg',
      uploaderId: 'owner-1',
      createdAt: new Date('2026-09-03T17:00:00Z'),
    },
  ];

  function arrange() {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(
      confirmedBooking,
    );
    (prisma.handoffPhoto.findMany as jest.Mock).mockResolvedValue(rows);
    return prisma;
  }

  it('returns both parties photos oldest first', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    const result = await service.findForBooking('b1', 'renter-1');

    expect(prisma.handoffPhoto.findMany).toHaveBeenCalledWith({
      where: { bookingId: 'b1' },
      orderBy: { createdAt: 'asc' },
    });
    expect(result).toHaveLength(2);
  });

  it('derives the uploader role rather than reading a stored column', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    const result = await service.findForBooking('b1', 'owner-1');

    expect(result[0].role).toBe('renter');
    expect(result[1].role).toBe('owner');
  });

  it('shows the renter the owner photos too', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    const result = await service.findForBooking('b1', 'renter-1');

    // A renter who cannot see the photos being used to claim against their
    // deposit cannot answer them.
    expect(result.map((p) => p.uploaderId)).toEqual(['renter-1', 'owner-1']);
  });

  it('refuses a non-party', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    await expect(service.findForBooking('b1', 'stranger-1')).rejects.toThrow(
      ForbiddenException,
    );

    expect(prisma.handoffPhoto.findMany).not.toHaveBeenCalled();
  });

  it('refuses a booking that does not exist', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(null);

    const service = new HandoffPhotosService(prisma);
    await expect(service.findForBooking('nope', 'renter-1')).rejects.toThrow(
      'Booking not found',
    );
  });

  it('reads photos on a completed booking, so a dispute can use them', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue({
      ...confirmedBooking,
      status: 'completed',
    });
    (prisma.handoffPhoto.findMany as jest.Mock).mockResolvedValue(rows);

    const service = new HandoffPhotosService(prisma);
    const result = await service.findForBooking('b1', 'owner-1');

    expect(result).toHaveLength(2);
  });
});
