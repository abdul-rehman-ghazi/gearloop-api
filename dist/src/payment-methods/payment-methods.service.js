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
exports.PaymentMethodsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
let PaymentMethodsService = class PaymentMethodsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(userId, dto) {
        return this.prisma.paymentMethod.create({ data: { ...dto, userId } });
    }
    findAllForUser(userId) {
        return this.prisma.paymentMethod.findMany({ where: { userId } });
    }
    async findById(id, userId) {
        const paymentMethod = await this.prisma.paymentMethod.findUnique({
            where: { id },
        });
        if (!paymentMethod)
            throw new common_1.NotFoundException('Payment method not found');
        if (paymentMethod.userId !== userId) {
            throw new common_1.ForbiddenException('You do not own this payment method');
        }
        return paymentMethod;
    }
    async remove(id, userId) {
        await this.findById(id, userId);
        try {
            await this.prisma.paymentMethod.delete({ where: { id } });
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                err.code === 'P2003') {
                throw new common_1.ConflictException('This payment method is used by existing bookings and cannot be deleted');
            }
            throw err;
        }
    }
};
exports.PaymentMethodsService = PaymentMethodsService;
exports.PaymentMethodsService = PaymentMethodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentMethodsService);
//# sourceMappingURL=payment-methods.service.js.map