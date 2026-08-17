import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { UpdateDisputeStatusDto } from './dto/update-dispute-status.dto';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';

@UseGuards(JwtAdminAuthGuard)
@Controller('admin/disputes')
export class AdminDisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.disputesService.findById(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateDisputeStatusDto) {
    return this.disputesService.updateStatus(id, dto);
  }
}
