import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessageEventsService } from './message-events.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessageEventsService],
})
export class MessagesModule {}
