import { MessagesService } from './messages.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

function makePrisma() {
  return {
    listing: {
      findUnique: jest.fn(),
    },
    messageThread: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue({ id: 't1' }),
    },
    message: {
      create: jest.fn().mockResolvedValue({ id: 'm1' }),
    },
  } as unknown as PrismaService;
}

function makeNotifications() {
  return {
    notify: jest.fn().mockResolvedValue({ id: 'n1' }),
  } as unknown as NotificationsService;
}

describe('MessagesService.createThread notifications', () => {
  it('notifies the listing owner about the first message', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      id: 'l1',
      title: 'Canon R5',
      ownerId: 'owner-1',
    });
    (prisma.messageThread.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.messageThread.create as jest.Mock).mockResolvedValue({ id: 't1' });

    const service = new MessagesService(prisma, notifications);
    await service.createThread('renter-1', {
      listingId: 'l1',
      text: 'Is this available?',
    });

    expect(notifications.notify).toHaveBeenCalledWith(
      'owner-1',
      'message_received',
      'New message about Canon R5',
      'Is this available?',
      '/messages/t1',
    );
  });
});

describe('MessagesService.sendMessage notifications', () => {
  const thread = {
    id: 't1',
    renterId: 'renter-1',
    listing: { id: 'l1', title: 'Canon R5', ownerId: 'owner-1' },
  };

  it('notifies the owner when the renter sends', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.messageThread.findUnique as jest.Mock).mockResolvedValue(thread);

    const service = new MessagesService(prisma, notifications);
    await service.sendMessage('t1', 'renter-1', { text: 'Still there?' });

    expect(notifications.notify).toHaveBeenCalledWith(
      'owner-1',
      'message_received',
      'New message about Canon R5',
      'Still there?',
      '/messages/t1',
    );
  });

  it('notifies the renter when the owner sends', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.messageThread.findUnique as jest.Mock).mockResolvedValue(thread);

    const service = new MessagesService(prisma, notifications);
    await service.sendMessage('t1', 'owner-1', { text: 'Yes it is.' });

    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'message_received',
      'New message about Canon R5',
      'Yes it is.',
      '/messages/t1',
    );
  });
});
