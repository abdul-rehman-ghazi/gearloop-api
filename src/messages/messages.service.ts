import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async createThread(renterId: string, dto: CreateThreadDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.ownerId === renterId) {
      throw new BadRequestException('You cannot message your own listing');
    }

    // Reuse an existing thread between this renter and this listing rather
    // than spawning duplicates every time they send a first message.
    let thread = await this.prisma.messageThread.findFirst({
      where: { listingId: dto.listingId, renterId },
    });

    if (!thread) {
      thread = await this.prisma.messageThread.create({
        data: { listingId: dto.listingId, renterId },
      });
    }

    await this.prisma.message.create({
      data: { threadId: thread.id, senderId: renterId, text: dto.text },
    });

    return this.prisma.messageThread.update({
      where: { id: thread.id },
      data: { unreadForOwner: true, unreadForRenter: false },
      include: { messages: { orderBy: { sentAt: 'asc' } } },
    });
  }

  async sendMessage(threadId: string, senderId: string, dto: SendMessageDto) {
    const thread = await this.findThreadWithAccess(threadId, senderId);
    const isRenter = thread.renterId === senderId;

    await this.prisma.message.create({
      data: { threadId, senderId, text: dto.text },
    });

    return this.prisma.messageThread.update({
      where: { id: threadId },
      data: isRenter
        ? { unreadForOwner: true, unreadForRenter: false }
        : { unreadForRenter: true, unreadForOwner: false },
      include: { messages: { orderBy: { sentAt: 'asc' } } },
    });
  }

  async findThreadsForUser(userId: string) {
    return this.prisma.messageThread.findMany({
      where: {
        OR: [{ renterId: userId }, { listing: { ownerId: userId } }],
      },
      include: {
        listing: true,
        messages: { orderBy: { sentAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findThreadById(threadId: string, userId: string) {
    const thread = await this.findThreadWithAccess(threadId, userId);
    const isRenter = thread.renterId === userId;

    // Viewing the thread marks it read for whichever side the caller is.
    return this.prisma.messageThread.update({
      where: { id: threadId },
      data: isRenter ? { unreadForRenter: false } : { unreadForOwner: false },
      include: { messages: { orderBy: { sentAt: 'asc' } } },
    });
  }

  private async findThreadWithAccess(threadId: string, userId: string) {
    const thread = await this.prisma.messageThread.findUnique({
      where: { id: threadId },
      include: { listing: true },
    });
    if (!thread) throw new NotFoundException('Thread not found');
    if (thread.renterId !== userId && thread.listing.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this thread');
    }
    return thread;
  }
}
