import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

@UseGuards(JwtUserAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@CurrentUser() user: UserAuthContext) {
    return this.notificationsService.findForUser(user.userId);
  }

  @Patch(':id/read')
  markRead(@CurrentUser() user: UserAuthContext, @Param('id') id: string) {
    return this.notificationsService.markRead(id, user.userId);
  }
}
