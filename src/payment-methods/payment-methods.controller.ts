import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

@UseGuards(JwtUserAuthGuard)
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  create(
    @CurrentUser() user: UserAuthContext,
    @Body() dto: CreatePaymentMethodDto,
  ) {
    return this.paymentMethodsService.create(user.userId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: UserAuthContext) {
    return this.paymentMethodsService.findAllForUser(user.userId);
  }

  @Get(':id')
  findById(@CurrentUser() user: UserAuthContext, @Param('id') id: string) {
    return this.paymentMethodsService.findById(id, user.userId);
  }

  @Delete(':id')
  remove(@CurrentUser() user: UserAuthContext, @Param('id') id: string) {
    return this.paymentMethodsService.remove(id, user.userId);
  }
}
