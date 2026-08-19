import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

// Admin-initiated edit — unlike the self-service UpdateUserDto (users/dto/
// update-user.dto.ts), email is editable here: an admin correcting a
// support-reported typo is a real use case a user can't self-serve if they
// no longer have access to the wrong inbox.
export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
