import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';

export class QuoteDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  pricePerDay!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  nights!: number;
}
