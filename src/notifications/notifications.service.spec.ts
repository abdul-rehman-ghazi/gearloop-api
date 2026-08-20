import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';
import { PrismaService } from '../prisma/prisma.service';

function makePrisma() {
  return {
    user: {
      findUnique: jest.fn(),
    },
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  } as unknown as PrismaService;
}

function makeEmail() {
  return { send: jest.fn().mockResolvedValue(undefined) } as unknown as EmailService;
}

describe('NotificationsService.notify', () => {
  it('creates the notification row and emails the user', async () => {
    const prisma = makePrisma();
    const email = makeEmail();
    (prisma.notification.create as jest.Mock).mockResolvedValue({ id: 'n1' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'u1',
      email: 'renter@example.com',
    });

    const service = new NotificationsService(prisma, email);
    const result = await service.notify(
      'u1',
      'booking_requested',
      'New booking request for Canon R5',
      'Request GL-1 is awaiting your response.',
      '/bookings/b1',
    );

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'u1',
        type: 'booking_requested',
        title: 'New booking request for Canon R5',
        body: 'Request GL-1 is awaiting your response.',
        link: '/bookings/b1',
      },
    });
    expect(email.send).toHaveBeenCalledWith(
      'renter@example.com',
      'New booking request for Canon R5',
      'Request GL-1 is awaiting your response.',
    );
    expect(result).toEqual({ id: 'n1' });
  });

  it('stores link as undefined when no link is given', async () => {
    const prisma = makePrisma();
    (prisma.notification.create as jest.Mock).mockResolvedValue({ id: 'n2' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'u1',
      email: 'renter@example.com',
    });

    const service = new NotificationsService(prisma, makeEmail());
    await service.notify('u1', 'dispute_resolved', 'Title', 'Body');

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'u1',
        type: 'dispute_resolved',
        title: 'Title',
        body: 'Body',
        link: undefined,
      },
    });
  });

  it('still returns the notification when the email send fails', async () => {
    const prisma = makePrisma();
    const email = makeEmail();
    (email.send as jest.Mock).mockRejectedValue(new Error('SMTP down'));
    (prisma.notification.create as jest.Mock).mockResolvedValue({ id: 'n3' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'u1',
      email: 'renter@example.com',
    });

    const service = new NotificationsService(prisma, email);
    await expect(
      service.notify('u1', 'message_received', 'Title', 'Body'),
    ).resolves.toEqual({ id: 'n3' });
  });

  it('still returns the notification when the user lookup finds nobody', async () => {
    const prisma = makePrisma();
    const email = makeEmail();
    (prisma.notification.create as jest.Mock).mockResolvedValue({ id: 'n4' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const service = new NotificationsService(prisma, email);
    await expect(
      service.notify('ghost', 'message_received', 'Title', 'Body'),
    ).resolves.toEqual({ id: 'n4' });
    expect(email.send).not.toHaveBeenCalled();
  });

  it('does not throw when notification.create itself fails', async () => {
    const prisma = makePrisma();
    const email = makeEmail();
    (prisma.notification.create as jest.Mock).mockRejectedValue(
      new Error('DB down'),
    );

    const service = new NotificationsService(prisma, email);
    await expect(
      service.notify('u1', 'message_received', 'Title', 'Body'),
    ).resolves.toBeUndefined();
    expect(email.send).not.toHaveBeenCalled();
  });
});

describe('NotificationsService.findForUser', () => {
  it('returns the caller notifications newest first', async () => {
    const prisma = makePrisma();
    (prisma.notification.findMany as jest.Mock).mockResolvedValue([
      { id: 'n1' },
    ]);

    const service = new NotificationsService(prisma, makeEmail());
    const result = await service.findForUser('u1');

    expect(prisma.notification.findMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual([{ id: 'n1' }]);
  });
});

describe('NotificationsService.markRead', () => {
  it('marks the notification read for its owner', async () => {
    const prisma = makePrisma();
    (prisma.notification.findUnique as jest.Mock).mockResolvedValue({
      id: 'n1',
      userId: 'u1',
    });
    (prisma.notification.update as jest.Mock).mockResolvedValue({
      id: 'n1',
      read: true,
    });

    const service = new NotificationsService(prisma, makeEmail());
    const result = await service.markRead('n1', 'u1');

    expect(prisma.notification.update).toHaveBeenCalledWith({
      where: { id: 'n1' },
      data: { read: true },
    });
    expect(result).toEqual({ id: 'n1', read: true });
  });

  it('404s when the notification does not exist', async () => {
    const prisma = makePrisma();
    (prisma.notification.findUnique as jest.Mock).mockResolvedValue(null);

    const service = new NotificationsService(prisma, makeEmail());
    await expect(service.markRead('nope', 'u1')).rejects.toThrow(
      NotFoundException,
    );
    expect(prisma.notification.update).not.toHaveBeenCalled();
  });

  it('403s when the notification belongs to someone else', async () => {
    const prisma = makePrisma();
    (prisma.notification.findUnique as jest.Mock).mockResolvedValue({
      id: 'n1',
      userId: 'someone-else',
    });

    const service = new NotificationsService(prisma, makeEmail());
    await expect(service.markRead('n1', 'u1')).rejects.toThrow(
      ForbiddenException,
    );
    expect(prisma.notification.update).not.toHaveBeenCalled();
  });
});
