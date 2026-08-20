import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';

// PrismaModule and ConfigModule are both global — no import needed here.
@Module({
  imports: [AuthModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
