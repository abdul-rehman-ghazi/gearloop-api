import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';

@UseGuards(JwtAdminAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Get('bookings')
  findAllBookings() {
    return this.adminService.findAllBookings();
  }
}
