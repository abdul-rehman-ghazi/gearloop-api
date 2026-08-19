import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListingStatus } from '../../generated/prisma/enums';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers() {
    const users = await this.prisma.user.findMany({
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
    if (!existing) throw new NotFoundException('User not found');
    const user = await this.prisma.user.update({
      where: { id },
      data: { isSuspended },
    });
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
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
      where: status ? { status } : undefined,
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
    if (!listing) throw new NotFoundException('Listing not found');
    const { owner, ...rest } = listing;
    const { passwordHash: _passwordHash, ...ownerRest } = owner;
    return { ...rest, owner: ownerRest };
  }
}
