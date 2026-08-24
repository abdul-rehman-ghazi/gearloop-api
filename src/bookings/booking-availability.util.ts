import type { Prisma } from '../../generated/prisma/client';

// A confirmed booking always blocks the calendar. Shared by every place that
// decides whether a date range is available:
// BookingsService.assertNoActiveOverlap, ListingsService.findAll/
// getBookedRanges/createBlackout.
export function blockingBooking(): Prisma.BookingWhereInput {
  return { status: 'confirmed' };
}
