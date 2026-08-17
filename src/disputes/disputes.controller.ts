import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

@UseGuards(JwtUserAuthGuard)
@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  create(@CurrentUser() user: UserAuthContext, @Body() dto: CreateDisputeDto) {
    return this.disputesService.create(user.userId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: UserAuthContext) {
    return this.disputesService.findAllForUser(user.userId);
  }

  @Get(':id')
  findById(@CurrentUser() user: UserAuthContext, @Param('id') id: string) {
    return this.disputesService.findById(id, user.userId);
  }
}
