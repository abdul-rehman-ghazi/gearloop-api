import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { normalizeEmail } from '../utils/normalize-email';

export class ResendVerificationDto {
  @Transform(normalizeEmail)
  @IsEmail()
  email: string;
}
