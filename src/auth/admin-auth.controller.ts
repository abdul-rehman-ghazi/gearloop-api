import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('signup')
  signup(@Body() dto: AdminSignupDto) {
    return this.adminAuthService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: AdminLoginDto) {
    return this.adminAuthService.login(dto);
  }
}
