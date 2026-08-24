import {
  IsDateString,
  IsEnum,
  IsISO31661Alpha2,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ListingCategory } from '../../../generated/prisma/enums';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchListingsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ListingCategory)
  category?: ListingCategory;

  @IsOptional()
  @IsISO31661Alpha2()
  country?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  ownerId?: string;
}
