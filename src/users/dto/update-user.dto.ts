import { IsOptional, IsString, MaxLength } from 'class-validator';

// name/responseTime only — email, passwordHash, isOwner, memberSince are
// never user-editable through this endpoint.
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  responseTime?: string;
}
