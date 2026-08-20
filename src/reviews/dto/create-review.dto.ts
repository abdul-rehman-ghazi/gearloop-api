import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  // `direction` and `revieweeId` are deliberately absent — both are derived
  // server-side from the booking, never accepted from the client.
  @IsOptional()
  @IsString()
  comment?: string;
}
