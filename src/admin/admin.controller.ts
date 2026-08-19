import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { ListingStatus } from '../../generated/prisma/enums';

@UseGuards(JwtAdminAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Patch('users/:id/suspend')
  suspendUser(@Param('id') id: string) {
    return this.adminService.suspendUser(id);
  }

  @Patch('users/:id/reinstate')
  reinstateUser(@Param('id') id: string) {
    return this.adminService.reinstateUser(id);
  }

  @Get('bookings')
  findAllBookings() {
    return this.adminService.findAllBookings();
  }

  @Get('listings')
  findAllListings(@Query('status') status?: ListingStatus) {
    return this.adminService.findAllListings(status);
  }

  @Get('listings/:id')
  findListingById(@Param('id') id: string) {
    return this.adminService.findListingById(id);
  }
}
