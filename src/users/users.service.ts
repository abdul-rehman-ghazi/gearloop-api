import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { computeInitials } from '../auth/utils/initials.util';
import { geocodeAddress } from '../common/geocoding';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const user = await this.findByIdOrThrow(userId);
    return this.sanitize(user);
  }

  async update(userId: string, dto: UpdateUserDto) {
    await this.findByIdOrThrow(userId);

    let geo: { lat: number; lng: number } | undefined;
    if (dto.address !== undefined) {
      const point = await geocodeAddress(dto.address);
      if (!point) throw new BadRequestException('Address not found');
      geo = point;
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        ...(dto.name && { initials: computeInitials(dto.name) }),
        ...(geo && { lat: geo.lat, lng: geo.lng }),
      },
    });
    return this.sanitize(user);
  }

  async findPublicProfile(id: string) {
    const user = await this.findByIdOrThrow(id);
    // Public view: no email, no passwordHash, no address/coordinates —
    // only what's safe to show a stranger browsing a listing. hasAddress
    // lets the renter know delivery is possible without seeing where.
    const {
      id: userId,
      name,
      initials,
      isOwner,
      memberSince,
      responseTime,
      lat,
      lng,
    } = user;
    return {
      id: userId,
      name,
      initials,
      isOwner,
      memberSince,
      responseTime,
      hasAddress: lat !== null && lng !== null,
    };
  }

  private async findByIdOrThrow(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || user.deletedAt) throw new NotFoundException('User not found');
    return user;
  }

  private sanitize(user: {
    passwordHash: string;
    lat: unknown;
    lng: unknown;
    [key: string]: unknown;
  }) {
    const { passwordHash: _passwordHash, lat: _lat, lng: _lng, ...rest } = user;
    return rest;
  }
}
