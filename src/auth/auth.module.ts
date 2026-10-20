import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerificationService } from './email-verification.service';
import { EmailService } from '../notifications/email.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { JwtUserStrategy } from './strategies/jwt-user.strategy';
import { JwtAdminStrategy } from './strategies/jwt-admin.strategy';
import { JwtUserAuthGuard } from './guards/jwt-user-auth.guard';
import { JwtAdminAuthGuard } from './guards/jwt-admin-auth.guard';
import { OptionalJwtUserAuthGuard } from './guards/optional-jwt-user-auth.guard';

// JwtModule is registered with no default secret/expiry — User and
// AdminUser need different secrets, so AuthService/AdminAuthService each
// pass their own `secret`/`expiresIn` directly to jwtService.sign(...)
// instead of relying on module-level config.
@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [AuthController, AdminAuthController],
  providers: [
    AuthService,
    EmailVerificationService,
    // NotificationsModule imports AuthModule, so importing it back here would
    // be circular; EmailService is stateless, so a second instance is harmless.
    EmailService,
    AdminAuthService,
    JwtUserStrategy,
    JwtAdminStrategy,
    JwtUserAuthGuard,
    JwtAdminAuthGuard,
    OptionalJwtUserAuthGuard,
  ],
  exports: [
    AdminAuthService,
    JwtUserAuthGuard,
    JwtAdminAuthGuard,
    OptionalJwtUserAuthGuard,
  ],
})
export class AuthModule {}
