import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

// Non-auth admin routes are intentionally not implemented yet (later
// session). AuthModule is imported so future routes here can use
// JwtAdminAuthGuard without re-registering passport/jwt wiring.
@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
