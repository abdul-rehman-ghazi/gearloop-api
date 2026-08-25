import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PricingController } from './pricing.controller';

@Module({
  imports: [AuthModule],
  controllers: [PricingController],
})
export class PricingModule {}
