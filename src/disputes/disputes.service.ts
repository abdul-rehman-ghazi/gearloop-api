import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeStatusDto } from './dto/update-dispute-status.dto';

@Injectable()
export class DisputesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateDisputeDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { listing: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.renterId !== userId && booking.listing.ownerId !== userId) {
      throw new ForbiddenException(
        'You are not a party to this booking',
      );
    }

    const existing = await this.prisma.dispute.findUnique({
      where: { bookingId: dto.bookingId },
    });
    if (existing) {
      throw new ConflictException('A dispute already exists for this booking');
    }

    return this.prisma.dispute.create({
      data: { bookingId: dto.bookingId, detail: dto.detail },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.dispute.findMany({
      where: {
        booking: {
          OR: [{ renterId: userId }, { listing: { ownerId: userId } }],
        },
      },
      include: { booking: true },
    });
  }

  async findById(id: string, userId?: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id },
      include: { booking: { include: { listing: true } } },
    });
    if (!dispute) throw new NotFoundException('Dispute not found');
    if (
      userId &&
      dispute.booking.renterId !== userId &&
      dispute.booking.listing.ownerId !== userId
    ) {
      throw new ForbiddenException('You are not a party to this dispute');
    }
    return dispute;
  }

  async updateStatus(id: string, dto: UpdateDisputeStatusDto) {
    await this.findById(id);
    return this.prisma.dispute.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
