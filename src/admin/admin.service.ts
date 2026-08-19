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

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers() {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { memberSince: 'desc' },
    });
    return users.map(({ passwordHash: _passwordHash, ...rest }) => rest);
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

  async findAllBookings() {
    const bookings = await this.prisma.booking.findMany({
      include: { listing: true, renter: true },
      orderBy: { createdAt: 'desc' },
    });
    return bookings.map(
      ({ renter: { passwordHash: _passwordHash, ...renter }, ...booking }) => ({
        ...booking,
        renter,
      }),
    );
  }

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
