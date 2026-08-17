import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ListingCategory } from '../../../generated/prisma/enums';

export class SearchListingsDto {
  @IsOptional()
  @IsEnum(ListingCategory)
  category?: ListingCategory;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
