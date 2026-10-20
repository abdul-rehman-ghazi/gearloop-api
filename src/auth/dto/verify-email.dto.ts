import { Transform } from 'class-transformer';
import { IsEmail, Matches } from 'class-validator';
import { normalizeEmail } from '../utils/normalize-email';

export class VerifyEmailDto {
  @Transform(normalizeEmail)
  @IsEmail()
  email: string;

  @Matches(/^\d{6}$/)
  code: string;
}
