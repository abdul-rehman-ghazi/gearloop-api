import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuoteDto } from './dto/quote.dto';
import {
  calculateBookingPricing,
  SERVICE_FEE_RATE,
  TAX_RATE,
} from '../bookings/booking-pricing.util';
import {
  deliveryFeeForDistance,
  haversineKm,
} from '../bookings/delivery-pricing.util';
import { PrismaService } from '../prisma/prisma.service';
import { OptionalJwtUserAuthGuard } from '../auth/guards/optional-jwt-user-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

@Controller('pricing')
export class PricingController {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(OptionalJwtUserAuthGuard)
  @Get('quote')
  async quote(@Query() dto: QuoteDto, @CurrentUser() user?: UserAuthContext) {
    const { subtotal, serviceFee, tax, total } = calculateBookingPricing(
      dto.pricePerDay,
      dto.nights,
    );
    const deliveryFee = await this.resolveDeliveryFee(dto, user);

    return {
      pricePerDay: dto.pricePerDay,
      nights: dto.nights,
      subtotal: subtotal.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      tax: tax.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      total: total.plus(deliveryFee).toFixed(2),
      serviceFeeRate: Number(SERVICE_FEE_RATE),
      taxRate: Number(TAX_RATE),
    };
  }

  // Never trusts a client-submitted fee — always recomputed from stored
  // coordinates. Same recomputation happens again in BookingsService.create
  // at actual booking time.
  private async resolveDeliveryFee(
    dto: QuoteDto,
    user?: UserAuthContext,
  ): Promise<number> {
    if (dto.pickupMethod !== 'delivery') return 0;
    if (!dto.listingId) {
      throw new BadRequestException(
        'listingId is required for delivery pricing',
      );
    }
    if (!user) {
      throw new BadRequestException('Sign in to get delivery pricing');
    }

    const [listing, renter] = await Promise.all([
      this.prisma.listing.findUnique({
        where: { id: dto.listingId },
        select: { owner: { select: { lat: true, lng: true } } },
      }),
      this.prisma.user.findUnique({
        where: { id: user.userId },
        select: { lat: true, lng: true },
      }),
    ]);

    if (!listing) throw new BadRequestException('Listing not found');
    if (listing.owner.lat === null || listing.owner.lng === null) {
      throw new BadRequestException(
        'This owner has not set a delivery address',
      );
    }
    if (!renter || renter.lat === null || renter.lng === null) {
      throw new BadRequestException(
        'Add your address in your profile to get delivery pricing',
      );
    }

    const km = haversineKm(
      { lat: Number(listing.owner.lat), lng: Number(listing.owner.lng) },
      { lat: Number(renter.lat), lng: Number(renter.lng) },
    );
    return deliveryFeeForDistance(km);
  }
}
