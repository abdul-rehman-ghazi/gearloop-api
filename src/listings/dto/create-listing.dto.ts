import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsISO31661Alpha2,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import {
  CancellationPolicy,
  ListingCategory,
} from '../../../generated/prisma/enums';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsEnum(ListingCategory)
  category: ListingCategory;

  // ISO 3166-1 alpha-2. Drives the listing's charge/display currency —
  // see src/common/country-currency.ts.
  @IsISO31661Alpha2()
  country: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  pricePerDay: number;

  // Optional; absent means 0, i.e. this listing takes no deposit. The upper
  // bound depends on pricePerDay, so it is checked in ListingsService (see
  // deposit-cap.util.ts) rather than with a flat @Max here.
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  depositAmount?: number;

  // Absent means the model default (`moderate`).
  @IsOptional()
  @IsEnum(CancellationPolicy)
  cancellationPolicy?: CancellationPolicy;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  images?: string[];
}
