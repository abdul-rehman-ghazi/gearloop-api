import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';

// ConfigModule is global (isGlobal: true in AppModule), so PaymentsService's
// ConfigService injection resolves without an imports array here. No
// controller — this module is consumed only through BookingsModule.
@Module({
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
