import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtUserAuthGuard)
  @Post('bookings/:bookingId/reviews')
  create(
    @CurrentUser() user: UserAuthContext,
    @Param('bookingId') bookingId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.userId, bookingId, dto);
  }

  @UseGuards(JwtUserAuthGuard)
  @Get('bookings/:bookingId/reviews')
  findForBooking(
    @CurrentUser() user: UserAuthContext,
    @Param('bookingId') bookingId: string,
  ) {
    return this.reviewsService.findForBooking(bookingId, user.userId);
  }

  @Get('listings/:listingId/reviews')
  findForListing(@Param('listingId') listingId: string) {
    return this.reviewsService.findForListing(listingId);
  }

  @Get('users/:userId/reviews')
  findForUser(@Param('userId') userId: string) {
    return this.reviewsService.findForUser(userId);
  }
}
