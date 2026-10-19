import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { computeInitials } from '../auth/utils/initials.util';
import {
  geocodeAddress,
  GeocodingUnavailableError,
  GeoPoint,
  reverseGeocode,
} from '../common/geocoding';

interface ResolvedLocation {
  address: string;
  lat: number;
  lng: number;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const user = await this.findByIdOrThrow(userId);
    return this.sanitize(user);
  }

  async update(userId: string, dto: UpdateUserDto) {
    await this.findByIdOrThrow(userId);
    const location = await this.resolveLocation(dto);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        ...(dto.name && { initials: computeInitials(dto.name) }),
        ...location,
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

  private async resolveLocation(
    dto: UpdateUserDto,
  ): Promise<ResolvedLocation | undefined> {
    if ((dto.lat === undefined) !== (dto.lng === undefined)) {
      throw new BadRequestException('lat and lng must be provided together');
    }
    if (dto.lat !== undefined && dto.lng !== undefined) {
      const point = { lat: dto.lat, lng: dto.lng };
      return { ...point, address: dto.address ?? (await labelFor(point)) };
    }
    if (dto.address === undefined) return undefined;

    const point = await geocodeOrThrow(dto.address);
    return { ...point, address: dto.address };
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

async function geocodeOrThrow(address: string): Promise<GeoPoint> {
  const point = await geocodeAddress(address).catch(rethrowAsUnavailable);
  if (!point) throw new BadRequestException('Address not found');
  return point;
}

// A missing label shouldn't block saving coordinates the browser already
// gave us; the raw point still lets the user see that a location is set.
async function labelFor(point: GeoPoint): Promise<string> {
  try {
    return await reverseGeocode(point);
  } catch (err) {
    if (!(err instanceof GeocodingUnavailableError)) throw err;
    return `Current location (${point.lat.toFixed(6)}, ${point.lng.toFixed(6)})`;
  }
}

function rethrowAsUnavailable(err: unknown): never {
  if (!(err instanceof GeocodingUnavailableError)) throw err;
  throw new ServiceUnavailableException(
    'Address lookup is unavailable right now. Try again in a moment.',
  );
}
