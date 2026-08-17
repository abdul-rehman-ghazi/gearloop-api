import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateThreadDto {
  @IsUUID()
  listingId: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
