import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import type { NotificationType } from '../../generated/prisma/enums';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  async notify(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    link?: string,
  ) {
    const notification = await this.prisma.notification.create({
      data: { userId, type, title, body, link },
    });

    // Email is best-effort: the in-app row is the durable channel, so a
    // failed send must never roll it back or fail the caller's request.
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) await this.email.send(user.email, title, body);
    } catch (err) {
      this.logger.error(
        `Failed to email notification ${notification.id} to user ${userId}: ${
          (err as Error).message
        }`,
      );
    }

    return notification;
  }

  findForUser(userId: string) {
    // No denormalized unread counter — callers filter on `read: false`.
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId) {
      throw new ForbiddenException('This notification is not yours');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }
}
