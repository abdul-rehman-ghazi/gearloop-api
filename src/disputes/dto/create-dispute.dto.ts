import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDisputeDto {
  @IsUUID()
  bookingId: string;

  @IsString()
  @IsNotEmpty()
  detail: string;
}
