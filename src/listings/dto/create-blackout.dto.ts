import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBlackoutDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  reason?: string;
}
