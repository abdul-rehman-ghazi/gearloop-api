import { IsDateString, IsEnum, IsUUID } from 'class-validator';
import { PickupMethod } from '../../../generated/prisma/enums';

export class CreateBookingDto {
  @IsUUID()
  listingId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(PickupMethod)
  pickupMethod: PickupMethod;

  @IsUUID()
  paymentMethodId: string;
}
