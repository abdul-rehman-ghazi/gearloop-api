import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { computeInitials } from '../auth/utils/initials.util';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const user = await this.findByIdOrThrow(userId);
    return this.sanitize(user);
  }

  async update(userId: string, dto: UpdateUserDto) {
    await this.findByIdOrThrow(userId);
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        ...(dto.name && { initials: computeInitials(dto.name) }),
      },
    });
    return this.sanitize(user);
  }

  async findPublicProfile(id: string) {
    const user = await this.findByIdOrThrow(id);
    // Public view: no email, no passwordHash — only what's safe to show a
    // stranger browsing a listing.
    const {
      id: userId,
      name,
      initials,
      isOwner,
      memberSince,
      responseTime,
    } = user;
    return { id: userId, name, initials, isOwner, memberSince, responseTime };
  }

  private async findByIdOrThrow(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || user.deletedAt) throw new NotFoundException('User not found');
    return user;
  }

  private sanitize(user: { passwordHash: string; [key: string]: unknown }) {
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
  }
}
