import { Controller, Get, Query } from '@nestjs/common';
import { QuoteDto } from './dto/quote.dto';
import {
  calculateBookingPricing,
  SERVICE_FEE_RATE,
  TAX_RATE,
} from '../bookings/booking-pricing.util';

@Controller('pricing')
export class PricingController {
  @Get('quote')
  quote(@Query() dto: QuoteDto) {
    const { subtotal, serviceFee, tax, total } = calculateBookingPricing(
      dto.pricePerDay,
      dto.nights,
    );
    return {
      pricePerDay: dto.pricePerDay,
      nights: dto.nights,
      subtotal: subtotal.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      serviceFeeRate: Number(SERVICE_FEE_RATE),
      taxRate: Number(TAX_RATE),
    };
  }
}
