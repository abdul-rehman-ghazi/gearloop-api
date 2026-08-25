import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsUUID, Min } from 'class-validator';
import { PickupMethod } from '../../../generated/prisma/enums';

export class QuoteDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  pricePerDay!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  nights!: number;

  @IsOptional()
  @IsEnum(PickupMethod)
  pickupMethod?: PickupMethod;

  @IsOptional()
  @IsUUID()
  listingId?: string;
}
