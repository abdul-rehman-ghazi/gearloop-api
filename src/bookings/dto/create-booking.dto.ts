import { IsEnum, IsUUID, Matches } from 'class-validator';
import { PickupMethod } from '../../../generated/prisma/enums';

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export class CreateBookingDto {
  @IsUUID()
  listingId: string;

  @Matches(DATE_ONLY_PATTERN, { message: 'must be a YYYY-MM-DD date' })
  startDate: string;

  @Matches(DATE_ONLY_PATTERN, { message: 'must be a YYYY-MM-DD date' })
  endDate: string;

  @IsEnum(PickupMethod)
  pickupMethod: PickupMethod;
}
