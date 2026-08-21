import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDisputeDto {
  @IsUUID()
  bookingId: string;

  @IsString()
  @IsNotEmpty()
  detail: string;

  // Optional. Absent = today's free-text dispute, unchanged. Present = a
  // damage claim against the booking's deposit; owner-only, and bounded by
  // booking.depositAmount in the service.
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  claimAmount?: number;
}
