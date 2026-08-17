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
exports.DisputesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DisputesService = class DisputesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            include: { listing: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.renterId !== userId && booking.listing.ownerId !== userId) {
            throw new common_1.ForbiddenException('You are not a party to this booking');
        }
        const existing = await this.prisma.dispute.findUnique({
            where: { bookingId: dto.bookingId },
        });
        if (existing) {
            throw new common_1.ConflictException('A dispute already exists for this booking');
        }
        return this.prisma.dispute.create({
            data: { bookingId: dto.bookingId, detail: dto.detail },
        });
    }
    async findAllForUser(userId) {
        return this.prisma.dispute.findMany({
            where: {
                booking: {
                    OR: [{ renterId: userId }, { listing: { ownerId: userId } }],
                },
            },
            include: { booking: true },
        });
    }
    async findById(id, userId) {
        const dispute = await this.prisma.dispute.findUnique({
            where: { id },
            include: { booking: { include: { listing: true } } },
        });
        if (!dispute)
            throw new common_1.NotFoundException('Dispute not found');
        if (userId &&
            dispute.booking.renterId !== userId &&
            dispute.booking.listing.ownerId !== userId) {
            throw new common_1.ForbiddenException('You are not a party to this dispute');
        }
        return dispute;
    }
    async updateStatus(id, dto) {
        await this.findById(id);
        return this.prisma.dispute.update({
            where: { id },
            data: { status: dto.status },
        });
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DisputesService);
//# sourceMappingURL=disputes.service.js.map