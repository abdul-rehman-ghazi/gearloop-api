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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const booking_pricing_util_1 = require("./booking-pricing.util");
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(renterId, dto) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: dto.listingId },
        });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        const paymentMethod = await this.prisma.paymentMethod.findUnique({
            where: { id: dto.paymentMethodId },
        });
        if (!paymentMethod || paymentMethod.userId !== renterId) {
            throw new common_1.NotFoundException('Payment method not found');
        }
        const start = new Date(dto.startDate);
        const end = new Date(dto.endDate);
        if (end <= start) {
            throw new common_1.BadRequestException('endDate must be after startDate');
        }
        await this.assertNoConfirmedOverlap(dto.listingId, start, end);
        const nights = Math.round((end.getTime() - start.getTime()) / 86_400_000);
        const { subtotal, serviceFee, tax, total } = (0, booking_pricing_util_1.calculateBookingPricing)(listing.pricePerDay, nights);
        try {
            return await this.prisma.booking.create({
                data: {
                    listingId: dto.listingId,
                    renterId,
                    paymentMethodId: dto.paymentMethodId,
                    pickupMethod: dto.pickupMethod,
                    startDate: start,
                    endDate: end,
                    pricePerDayAtBooking: listing.pricePerDay,
                    nights,
                    subtotal,
                    serviceFee,
                    tax,
                    total,
                },
            });
        }
        catch (err) {
            if (this.isExclusionViolation(err)) {
                throw new common_1.ConflictException('Listing is not available for the selected dates');
            }
            throw err;
        }
    }
    async findById(id) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        return booking;
    }
    findByUser(renterId) {
        return this.prisma.booking.findMany({
            where: { renterId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(id, dto) {
        await this.findById(id);
        if (dto.status === 'confirmed') {
            const booking = await this.prisma.booking.findUniqueOrThrow({
                where: { id },
            });
            await this.assertNoConfirmedOverlap(booking.listingId, booking.startDate, booking.endDate, id);
        }
        try {
            return await this.prisma.booking.update({
                where: { id },
                data: { status: dto.status },
            });
        }
        catch (err) {
            if (this.isExclusionViolation(err)) {
                throw new common_1.ConflictException('Listing is not available for the selected dates');
            }
            throw err;
        }
    }
    async assertNoConfirmedOverlap(listingId, start, end, excludeBookingId) {
        const conflict = await this.prisma.booking.findFirst({
            where: {
                listingId,
                status: 'confirmed',
                startDate: { lt: end },
                endDate: { gt: start },
                ...(excludeBookingId && { id: { not: excludeBookingId } }),
            },
        });
        if (conflict) {
            throw new common_1.ConflictException('Listing is not available for the selected dates');
        }
    }
    isExclusionViolation(err) {
        const meta = err?.meta;
        const code = meta?.code ??
            err?.code;
        const message = err?.message ?? '';
        return (code === '23P01' ||
            message.includes('23P01') ||
            message.toLowerCase().includes('exclusion'));
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map