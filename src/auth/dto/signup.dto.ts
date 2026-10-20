import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { normalizeEmail } from '../utils/normalize-email';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Transform(normalizeEmail)
  @IsEmail()
  email: string;

  // bcrypt silently truncates input beyond 72 bytes.
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
