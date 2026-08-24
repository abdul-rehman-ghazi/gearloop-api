import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import { CreateBlackoutDto } from './dto/create-blackout.dto';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { OptionalJwtUserAuthGuard } from '../auth/guards/optional-jwt-user-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @UseGuards(JwtUserAuthGuard)
  @Post()
  create(@CurrentUser() user: UserAuthContext, @Body() dto: CreateListingDto) {
    return this.listingsService.create(user.userId, dto);
  }

  @UseGuards(OptionalJwtUserAuthGuard)
  @Get()
  findAll(
    @Query() dto: SearchListingsDto,
    @CurrentUser() user?: UserAuthContext,
  ) {
    return this.listingsService.findAll(dto, user?.userId);
  }

  @Get(':id/booked-ranges')
  getBookedRanges(@Param('id') id: string) {
    return this.listingsService.getBookedRanges(id);
  }

  @UseGuards(JwtUserAuthGuard)
  @Get(':id/blackouts')
  listBlackouts(@CurrentUser() user: UserAuthContext, @Param('id') id: string) {
    return this.listingsService.listBlackouts(id, user.userId);
  }

  @UseGuards(JwtUserAuthGuard)
  @Post(':id/blackouts')
  createBlackout(
    @CurrentUser() user: UserAuthContext,
    @Param('id') id: string,
    @Body() dto: CreateBlackoutDto,
  ) {
    return this.listingsService.createBlackout(id, user.userId, dto);
  }

  @UseGuards(JwtUserAuthGuard)
  @Delete(':id/blackouts/:blackoutId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeBlackout(
    @CurrentUser() user: UserAuthContext,
    @Param('id') id: string,
    @Param('blackoutId') blackoutId: string,
  ) {
    return this.listingsService.removeBlackout(id, blackoutId, user.userId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.listingsService.findById(id);
  }

  @UseGuards(JwtUserAuthGuard)
  @Patch(':id')
  update(
    @CurrentUser() user: UserAuthContext,
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, user.userId, dto);
  }

  @UseGuards(JwtUserAuthGuard)
  @Patch(':id/pause')
  pause(@CurrentUser() user: UserAuthContext, @Param('id') id: string) {
    return this.listingsService.pause(id, user.userId);
  }

  @UseGuards(JwtUserAuthGuard)
  @Patch(':id/activate')
  activate(@CurrentUser() user: UserAuthContext, @Param('id') id: string) {
    return this.listingsService.activate(id, user.userId);
  }

  @UseGuards(JwtUserAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: UserAuthContext, @Param('id') id: string) {
    return this.listingsService.remove(id, user.userId);
  }
}
