import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AdminSignupDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
