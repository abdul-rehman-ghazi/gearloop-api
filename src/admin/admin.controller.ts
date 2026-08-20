import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { ListingStatus } from '../../generated/prisma/enums';
import { AdminUpdateUserDto } from './dto/update-user.dto';
import { UpdateListingDto } from '../listings/dto/update-listing.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@UseGuards(JwtAdminAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  findAllUsers(@Query() dto: PaginationDto) {
    return this.adminService.findAllUsers(dto);
  }

  @Get('users/:id')
  findUserById(@Param('id') id: string) {
    return this.adminService.findUserById(id);
  }

  @Get('revenue')
  getRevenue() {
    return this.adminService.getRevenue();
  }

  @Patch('users/:id/suspend')
  suspendUser(@Param('id') id: string) {
    return this.adminService.suspendUser(id);
  }

  @Patch('users/:id/reinstate')
  reinstateUser(@Param('id') id: string) {
    return this.adminService.reinstateUser(id);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.adminService.updateUser(id, dto);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('bookings')
  findAllBookings(@Query() dto: PaginationDto) {
    return this.adminService.findAllBookings(dto);
  }

  @Get('listings')
  findAllListings(@Query('status') status?: ListingStatus) {
    return this.adminService.findAllListings(status);
  }

  @Get('listings/:id')
  findListingById(@Param('id') id: string) {
    return this.adminService.findListingById(id);
  }

  @Patch('listings/:id')
  updateListing(@Param('id') id: string, @Body() dto: UpdateListingDto) {
    return this.adminService.updateListing(id, dto);
  }

  @Delete('listings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteListing(@Param('id') id: string) {
    return this.adminService.deleteListing(id);
  }
}
