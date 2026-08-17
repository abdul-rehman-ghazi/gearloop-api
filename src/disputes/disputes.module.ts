import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DisputesController } from './disputes.controller';
import { AdminDisputesController } from './admin-disputes.controller';
import { DisputesService } from './disputes.service';

@Module({
  imports: [AuthModule],
  controllers: [DisputesController, AdminDisputesController],
  providers: [DisputesService],
})
export class DisputesModule {}
