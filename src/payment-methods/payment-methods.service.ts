import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreatePaymentMethodDto) {
    return this.prisma.paymentMethod.create({ data: { ...dto, userId } });
  }

  findAllForUser(userId: string) {
    return this.prisma.paymentMethod.findMany({ where: { userId } });
  }

  async findById(id: string, userId: string) {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id },
    });
    if (!paymentMethod) throw new NotFoundException('Payment method not found');
    if (paymentMethod.userId !== userId) {
      throw new ForbiddenException('You do not own this payment method');
    }
    return paymentMethod;
  }

  async remove(id: string, userId: string) {
    await this.findById(id, userId);
    try {
      await this.prisma.paymentMethod.delete({ where: { id } });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2003'
      ) {
        throw new ConflictException(
          'This payment method is used by existing bookings and cannot be deleted',
        );
      }
      throw err;
    }
  }
}
