"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ListingsService = class ListingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(ownerId, dto) {
        const listing = await this.prisma.listing.create({
            data: { ...dto, ownerId },
        });
        await this.prisma.user.updateMany({
            where: { id: ownerId, isOwner: false },
            data: { isOwner: true },
        });
        return listing;
    }
    async findAll(dto, callerUserId) {
        const where = {
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
        return this.prisma.listing.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const listing = await this.prisma.listing.findUnique({ where: { id } });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        return listing;
    }
    async update(id, ownerId, dto) {
        await this.assertOwnership(id, ownerId);
        return this.prisma.listing.update({ where: { id }, data: dto });
    }
    async pause(id, ownerId) {
        await this.assertOwnership(id, ownerId);
        return this.prisma.listing.update({
            where: { id },
            data: { status: 'paused' },
        });
    }
    async remove(id, ownerId) {
        await this.assertOwnership(id, ownerId);
        const activeBooking = await this.prisma.booking.findFirst({
            where: { listingId: id, status: { in: ['pending', 'confirmed'] } },
        });
        if (activeBooking) {
            throw new common_1.ConflictException('This listing has an active booking and cannot be deleted');
        }
        await this.prisma.listing.delete({ where: { id } });
    }
    async activate(id, ownerId) {
        await this.assertOwnership(id, ownerId);
        return this.prisma.listing.update({
            where: { id },
            data: { status: 'active' },
        });
    }
    async approve(id) {
        await this.findById(id);
        return this.prisma.listing.update({
            where: { id },
            data: { status: 'active' },
        });
    }
    async reject(id) {
        await this.findById(id);
        return this.prisma.listing.update({
            where: { id },
            data: { status: 'rejected' },
        });
    }
    async assertOwnership(id, ownerId) {
        const listing = await this.findById(id);
        if (listing.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You do not own this listing');
        }
        return listing;
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map