import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { memberSince: 'desc' },
    });
    return users.map(({ passwordHash: _passwordHash, ...rest }) => rest);
  }

  async findAllBookings() {
    const bookings = await this.prisma.booking.findMany({
      include: { listing: true, renter: true },
      orderBy: { createdAt: 'desc' },
    });
    return bookings.map(({ renter: { passwordHash: _passwordHash, ...renter }, ...booking }) => ({
      ...booking,
      renter,
    }));
  }
}
