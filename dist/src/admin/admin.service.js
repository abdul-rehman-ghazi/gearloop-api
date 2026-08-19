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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const initials_util_1 = require("../auth/utils/initials.util");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllUsers() {
        const users = await this.prisma.user.findMany({
            orderBy: { memberSince: 'desc' },
        });
        return users.map(({ passwordHash: _passwordHash, ...rest }) => rest);
    }
    async suspendUser(id) {
        return this.setUserSuspended(id, true);
    }
    async reinstateUser(id) {
        return this.setUserSuspended(id, false);
    }
    async setUserSuspended(id, isSuspended) {
        const existing = await this.prisma.user.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('User not found');
        const user = await this.prisma.user.update({
            where: { id },
            data: { isSuspended },
        });
        const { passwordHash: _passwordHash, ...rest } = user;
        return rest;
    }
    async updateUser(id, dto) {
        const existing = await this.prisma.user.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('User not found');
        if (dto.email && dto.email !== existing.email) {
            const emailTaken = await this.prisma.user.findUnique({
                where: { email: dto.email },
            });
            if (emailTaken)
                throw new common_1.ConflictException('Email is already in use');
        }
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.name && { initials: (0, initials_util_1.computeInitials)(dto.name) }),
            },
        });
        const { passwordHash: _passwordHash, ...rest } = user;
        return rest;
    }
    async deleteUser(id) {
        const existing = await this.prisma.user.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('User not found');
        const hasBookingHistory = await this.prisma.booking.findFirst({
            where: { OR: [{ renterId: id }, { listing: { ownerId: id } }] },
        });
        if (hasBookingHistory) {
            throw new common_1.ConflictException('This user has booking history and cannot be deleted');
        }
        await this.prisma.$transaction([
            this.prisma.paymentMethod.deleteMany({ where: { userId: id } }),
            this.prisma.listing.deleteMany({ where: { ownerId: id } }),
            this.prisma.user.delete({ where: { id } }),
        ]);
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
    async findAllListings(status) {
        const listings = await this.prisma.listing.findMany({
            where: status ? { status } : undefined,
            include: { owner: true },
            orderBy: { createdAt: 'desc' },
        });
        return listings.map(({ owner: { passwordHash: _passwordHash, ...owner }, ...listing }) => ({
            ...listing,
            owner,
        }));
    }
    async findListingById(id) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: { owner: true },
        });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        const { owner, ...rest } = listing;
        const { passwordHash: _passwordHash, ...ownerRest } = owner;
        return { ...rest, owner: ownerRest };
    }
    async updateListing(id, dto) {
        const existing = await this.prisma.listing.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Listing not found');
        const listing = await this.prisma.listing.update({
            where: { id },
            data: dto,
            include: { owner: true },
        });
        const { owner, ...rest } = listing;
        const { passwordHash: _passwordHash, ...ownerRest } = owner;
        return { ...rest, owner: ownerRest };
    }
    async deleteListing(id) {
        const listing = await this.prisma.listing.findUnique({ where: { id } });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        const activeBooking = await this.prisma.booking.findFirst({
            where: { listingId: id, status: { in: ['pending', 'confirmed'] } },
        });
        if (activeBooking) {
            throw new common_1.ConflictException('This listing has an active booking and cannot be deleted');
        }
        await this.prisma.listing.delete({ where: { id } });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map