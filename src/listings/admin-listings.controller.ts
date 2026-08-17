import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';

@UseGuards(JwtAdminAuthGuard)
@Controller('admin/listings')
export class AdminListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.listingsService.approve(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.listingsService.reject(id);
  }
}
