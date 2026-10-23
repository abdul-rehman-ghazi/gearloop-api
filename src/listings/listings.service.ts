import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import { CreateBlackoutDto } from './dto/create-blackout.dto';
import { Prisma } from '../../generated/prisma/client';
import { blockingBooking } from '../bookings/booking-availability.util';
import { assertDepositWithinCap } from './deposit-cap.util';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateListingDto) {
    assertDepositWithinCap(dto.depositAmount ?? 0, dto.pricePerDay);
    const listing = await this.prisma.listing.create({
      data: { ...dto, ownerId },
    });

    // Idempotent flip, no read-then-write race: only touches the row when
    // isOwner is still false.
    await this.prisma.user.updateMany({
      where: { id: ownerId, isOwner: false },
      data: { isOwner: true },
    });

    return listing;
  }

  async findAll(dto: SearchListingsDto, callerUserId?: string) {
    const where: Prisma.ListingWhereInput = {
      deletedAt: null,
      ...(callerUserId
        ? { OR: [{ status: 'active' }, { ownerId: callerUserId }] }
        : { status: 'active' }),
      ...(dto.category && { category: dto.category }),
      ...(dto.country && { country: dto.country }),
      ...(dto.ownerId && { ownerId: dto.ownerId }),
    };

    if (dto.startDate && dto.endDate) {
      const start = new Date(dto.startDate);
      const end = new Date(dto.endDate);
      where.bookings = {
        none: {
          ...blockingBooking(),
          startDate: { lt: end },
          endDate: { gt: start },
        },
      };
      where.blackouts = {
        none: {
          startDate: { lt: end },
          endDate: { gt: start },
        },
      };
    }

    const page = dto.page ?? 1;
    const pageSize = dto.pageSize ?? 24;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.listing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.listing.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findById(id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing || listing.deletedAt) {
      throw new NotFoundException('Listing not found');
    }
    return listing;
  }

  async getBookedRanges(id: string) {
    await this.findById(id);
    const [bookings, blackouts] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where: { listingId: id, ...blockingBooking(), deletedAt: null },
        select: { startDate: true, endDate: true },
      }),
      this.prisma.blackout.findMany({
        where: { listingId: id },
        select: { startDate: true, endDate: true },
      }),
    ]);
    return [...bookings, ...blackouts];
  }

  async update(id: string, ownerId: string, dto: UpdateListingDto) {
    const listing = await this.assertOwnership(id, ownerId);
    // A partial update is checked against the stored values it leaves alone.
    assertDepositWithinCap(
      dto.depositAmount ?? Number(listing.depositAmount),
      dto.pricePerDay ?? Number(listing.pricePerDay),
    );
    return this.prisma.listing.update({ where: { id }, data: dto });
  }

  async pause(id: string, ownerId: string) {
    const listing = await this.assertOwnership(id, ownerId);
    if (listing.status !== 'active') {
      throw new ConflictException('Only an active listing can be paused');
    }
    return this.prisma.listing.update({
      where: { id },
      data: { status: 'paused' },
    });
  }

  async remove(id: string, ownerId: string) {
    await this.assertOwnership(id, ownerId);

    const activeBooking = await this.prisma.booking.findFirst({
      where: {
        listingId: id,
        status: { in: ['pending', 'confirmed'] },
      },
    });
    if (activeBooking) {
      throw new ConflictException(
        'This listing has an active booking and cannot be deleted',
      );
    }

    await this.prisma.listing.delete({ where: { id } });
  }

  async activate(id: string, ownerId: string) {
    const listing = await this.assertOwnership(id, ownerId);
    if (listing.status !== 'paused') {
      throw new ConflictException('Only a paused listing can be resumed');
    }
    return this.prisma.listing.update({
      where: { id },
      data: { status: 'active' },
    });
  }

  async approve(id: string) {
    await this.findById(id);
    return this.prisma.listing.update({
      where: { id },
      data: { status: 'active' },
    });
  }

  async reject(id: string) {
    await this.findById(id);
    return this.prisma.listing.update({
      where: { id },
      data: { status: 'rejected' },
    });
  }

  async listBlackouts(listingId: string, ownerId: string) {
    await this.assertOwnership(listingId, ownerId);
    return this.prisma.blackout.findMany({
      where: { listingId },
      orderBy: { startDate: 'asc' },
    });
  }

  async createBlackout(
    listingId: string,
    ownerId: string,
    dto: CreateBlackoutDto,
  ) {
    await this.assertOwnership(listingId, ownerId);

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end <= start) {
      throw new BadRequestException('endDate must be after startDate');
    }

    const activeOverlap = await this.prisma.booking.findFirst({
      where: {
        listingId,
        ...blockingBooking(),
        deletedAt: null,
        startDate: { lt: end },
        endDate: { gt: start },
      },
    });
    if (activeOverlap) {
      throw new ConflictException('Those dates already have an active booking');
    }

    return this.prisma.blackout.create({
      data: { listingId, startDate: start, endDate: end, reason: dto.reason },
    });
  }

  async removeBlackout(listingId: string, blackoutId: string, ownerId: string) {
    await this.assertOwnership(listingId, ownerId);
    await this.prisma.blackout.deleteMany({
      where: { id: blackoutId, listingId },
    });
  }

  private async assertOwnership(id: string, ownerId: string) {
    const listing = await this.findById(id);
    if (listing.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this listing');
    }
    return listing;
  }
}
