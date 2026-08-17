import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
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

  @IsString()
  @IsNotEmpty()
  description: string;
}
