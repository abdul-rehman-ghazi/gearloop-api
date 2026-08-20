import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateListingDto) {
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
      ...(dto.location && {
        location: { contains: dto.location, mode: 'insensitive' },
      }),
      ...(dto.ownerId && { ownerId: dto.ownerId }),
    };

    if (dto.startDate && dto.endDate) {
      const start = new Date(dto.startDate);
      const end = new Date(dto.endDate);
      where.bookings = {
        none: {
          status: 'confirmed',
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
    return this.prisma.booking.findMany({
      where: { listingId: id, status: 'confirmed', deletedAt: null },
      select: { startDate: true, endDate: true },
    });
  }

  async update(id: string, ownerId: string, dto: UpdateListingDto) {
    await this.assertOwnership(id, ownerId);
    return this.prisma.listing.update({ where: { id }, data: dto });
  }

  async pause(id: string, ownerId: string) {
    await this.assertOwnership(id, ownerId);
    return this.prisma.listing.update({
      where: { id },
      data: { status: 'paused' },
    });
  }

  async remove(id: string, ownerId: string) {
    await this.assertOwnership(id, ownerId);

    const activeBooking = await this.prisma.booking.findFirst({
      where: { listingId: id, status: { in: ['pending', 'confirmed'] } },
    });
    if (activeBooking) {
      throw new ConflictException(
        'This listing has an active booking and cannot be deleted',
      );
    }

    await this.prisma.listing.delete({ where: { id } });
  }

  async activate(id: string, ownerId: string) {
    await this.assertOwnership(id, ownerId);
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

  private async assertOwnership(id: string, ownerId: string) {
    const listing = await this.findById(id);
    if (listing.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this listing');
    }
    return listing;
  }
}
