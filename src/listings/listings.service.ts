import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
      ...(callerUserId
        ? { OR: [{ status: 'active' }, { ownerId: callerUserId }] }
        : { status: 'active' }),
      ...(dto.category && { category: dto.category }),
      ...(dto.location && {
        location: { contains: dto.location, mode: 'insensitive' },
      }),
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

    return this.prisma.listing.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
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
