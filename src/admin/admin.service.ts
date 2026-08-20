import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListingStatus } from '../../generated/prisma/enums';
import { AdminUpdateUserDto } from './dto/update-user.dto';
import { UpdateListingDto } from '../listings/dto/update-listing.dto';
import { computeInitials } from '../auth/utils/initials.util';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SERVICE_FEE_RATE } from '../bookings/booking-pricing.util';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers(dto: PaginationDto) {
    const page = dto.page ?? 1;
    const pageSize = dto.pageSize ?? 24;
    const where = { deletedAt: null };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: { memberSince: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.user.count({ where }),
    ]);
    return {
      items: users.map(({ passwordHash: _passwordHash, ...rest }) => rest),
      total,
      page,
      pageSize,
    };
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
  }

  async suspendUser(id: string) {
    return this.setUserSuspended(id, true);
  }

  async reinstateUser(id: string) {
    return this.setUserSuspended(id, false);
  }

  private async setUserSuspended(id: string, isSuspended: boolean) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('User not found');
    }
    const user = await this.prisma.user.update({
      where: { id },
      data: { isSuspended },
    });
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
  }

  async updateUser(id: string, dto: AdminUpdateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== existing.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (emailTaken) throw new ConflictException('Email is already in use');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.name && { initials: computeInitials(dto.name) }),
      },
    });
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
  }

  async deleteUser(id: string) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('User not found');
    }

    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.booking.updateMany({
        where: { listing: { ownerId: id } },
        data: { deletedAt: now },
      }),
      this.prisma.listing.updateMany({
        where: { ownerId: id },
        data: { deletedAt: now },
      }),
      this.prisma.user.update({ where: { id }, data: { deletedAt: now } }),
    ]);
  }

  async findAllBookings(dto: PaginationDto) {
    const page = dto.page ?? 1;
    const pageSize = dto.pageSize ?? 24;

    const [bookings, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        include: { listing: true, renter: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.booking.count(),
    ]);
    return {
      items: bookings.map(
        ({
          renter: { passwordHash: _passwordHash, ...renter },
          ...booking
        }) => ({
          ...booking,
          renter,
        }),
      ),
      total,
      page,
      pageSize,
    };
  }

  async getRevenue() {
    const start = new Date();
    start.setMonth(start.getMonth() - 5, 1);
    start.setHours(0, 0, 0, 0);

    const bookings = await this.prisma.booking.findMany({
      where: { createdAt: { gte: start }, status: { not: 'cancelled' }, deletedAt: null },
      select: { createdAt: true, total: true },
    });

    const totalRevenue30d = bookings
      .filter((b) => b.createdAt >= thirtyDaysAgo())
      .reduce((sum, b) => sum + Number(b.total), 0);

    const monthly = last6Months().map(({ label, year, month }) => ({
      label,
      amount: bookings
        .filter(
          (b) =>
            b.createdAt.getFullYear() === year &&
            b.createdAt.getMonth() === month,
        )
        .reduce((sum, b) => sum + Number(b.total), 0),
    }));

    return {
      totalRevenue30d,
      takeRatePercent: Number(SERVICE_FEE_RATE) * 100,
      monthly,
    };
  }

  // ponytail: unbounded on purpose — admin dashboard/revenue derive
  // activeListingCount from the full set; paginating this needs a counts
  // endpoint too, out of scope here.
  async findAllListings(status?: ListingStatus) {
    const listings = await this.prisma.listing.findMany({
      where: { deletedAt: null, ...(status && { status }) },
      include: { owner: true },
      orderBy: { createdAt: 'desc' },
    });
    return listings.map(
      ({ owner: { passwordHash: _passwordHash, ...owner }, ...listing }) => ({
        ...listing,
        owner,
      }),
    );
  }

  async findListingById(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (!listing || listing.deletedAt) {
      throw new NotFoundException('Listing not found');
    }
    const { owner, ...rest } = listing;
    const { passwordHash: _passwordHash, ...ownerRest } = owner;
    return { ...rest, owner: ownerRest };
  }

  async updateListing(id: string, dto: UpdateListingDto) {
    const existing = await this.prisma.listing.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Listing not found');
    }

    const listing = await this.prisma.listing.update({
      where: { id },
      data: dto,
      include: { owner: true },
    });
    const { owner, ...rest } = listing;
    const { passwordHash: _passwordHash, ...ownerRest } = owner;
    return { ...rest, owner: ownerRest };
  }

  async deleteListing(id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing || listing.deletedAt) {
      throw new NotFoundException('Listing not found');
    }

    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.booking.updateMany({
        where: { listingId: id },
        data: { deletedAt: now },
      }),
      this.prisma.listing.update({ where: { id }, data: { deletedAt: now } }),
    ]);
  }
}

function thirtyDaysAgo(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d;
}

function last6Months(): { label: string; year: number; month: number }[] {
  const now = new Date();
  const result: { label: string; year: number; month: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      label: d.toLocaleString('en-US', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }
  return result;
}
