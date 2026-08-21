import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ListingCategory } from '../../../generated/prisma/enums';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsEnum(ListingCategory)
  category: ListingCategory;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  pricePerDay: number;

  // Optional; absent means 0, i.e. this listing takes no deposit. The Max is
  // a fat-finger guard, not a business rule — a mistyped 100000 would place
  // a five-figure hold on a real renter's card.
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10000)
  depositAmount?: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  images?: string[];
}
