import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtUserAuthGuard)
  @Get('me')
  me(@CurrentUser() user: UserAuthContext) {
    return this.usersService.me(user.userId);
  }

  @UseGuards(JwtUserAuthGuard)
  @Patch('me')
  update(@CurrentUser() user: UserAuthContext, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.userId, dto);
  }

  // Public — viewing a listing shows its owner's name/initials/etc.
  @Get(':id')
  findPublicProfile(@Param('id') id: string) {
    return this.usersService.findPublicProfile(id);
  }
}
