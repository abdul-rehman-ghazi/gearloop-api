import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { DisputesController } from './disputes.controller';
import { AdminDisputesController } from './admin-disputes.controller';
import { DisputesService } from './disputes.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [DisputesController, AdminDisputesController],
  providers: [DisputesService],
})
export class DisputesModule {}
