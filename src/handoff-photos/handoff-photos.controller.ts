import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { HandoffPhotosService } from './handoff-photos.service';
import { CreateHandoffPhotoDto } from './dto/create-handoff-photo.dto';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

// Both routes are party-only, so the guard sits on the class rather than
// per-method (ReviewsController splits them only because two of its routes
// are public; none of these are).
@UseGuards(JwtUserAuthGuard)
@Controller('bookings/:bookingId/handoff-photos')
export class HandoffPhotosController {
  constructor(private readonly handoffPhotosService: HandoffPhotosService) {}

  @Post()
  create(
    @CurrentUser() user: UserAuthContext,
    @Param('bookingId') bookingId: string,
    @Body() dto: CreateHandoffPhotoDto,
  ) {
    return this.handoffPhotosService.create(user.userId, bookingId, dto);
  }

  @Get()
  findForBooking(
    @CurrentUser() user: UserAuthContext,
    @Param('bookingId') bookingId: string,
  ) {
    return this.handoffPhotosService.findForBooking(bookingId, user.userId);
  }
}
