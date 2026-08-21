import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { DisputeStatus } from '../../../generated/prisma/enums';

export class UpdateDisputeStatusDto {
  @IsEnum(DisputeStatus)
  status: DisputeStatus;

  // What the admin awards the owner out of the deposit, 0 <= this <=
  // claimAmount. Only meaningful alongside status: 'resolved'. Omitting it
  // on a claim dispute resolves in the renter's favour: full release.
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  resolvedAmount?: number;
}
