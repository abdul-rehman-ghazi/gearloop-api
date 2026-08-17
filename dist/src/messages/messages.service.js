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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createThread(renterId, dto) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: dto.listingId },
        });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        if (listing.ownerId === renterId) {
            throw new common_1.BadRequestException('You cannot message your own listing');
        }
        let thread = await this.prisma.messageThread.findFirst({
            where: { listingId: dto.listingId, renterId },
        });
        if (!thread) {
            thread = await this.prisma.messageThread.create({
                data: { listingId: dto.listingId, renterId },
            });
        }
        await this.prisma.message.create({
            data: { threadId: thread.id, senderId: renterId, text: dto.text },
        });
        return this.prisma.messageThread.update({
            where: { id: thread.id },
            data: { unreadForOwner: true, unreadForRenter: false },
            include: { messages: { orderBy: { sentAt: 'asc' } } },
        });
    }
    async sendMessage(threadId, senderId, dto) {
        const thread = await this.findThreadWithAccess(threadId, senderId);
        const isRenter = thread.renterId === senderId;
        await this.prisma.message.create({
            data: { threadId, senderId, text: dto.text },
        });
        return this.prisma.messageThread.update({
            where: { id: threadId },
            data: isRenter
                ? { unreadForOwner: true, unreadForRenter: false }
                : { unreadForRenter: true, unreadForOwner: false },
            include: { messages: { orderBy: { sentAt: 'asc' } } },
        });
    }
    async findThreadsForUser(userId) {
        return this.prisma.messageThread.findMany({
            where: {
                OR: [{ renterId: userId }, { listing: { ownerId: userId } }],
            },
            include: {
                listing: true,
                messages: { orderBy: { sentAt: 'desc' }, take: 1 },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findThreadById(threadId, userId) {
        const thread = await this.findThreadWithAccess(threadId, userId);
        const isRenter = thread.renterId === userId;
        return this.prisma.messageThread.update({
            where: { id: threadId },
            data: isRenter ? { unreadForRenter: false } : { unreadForOwner: false },
            include: { messages: { orderBy: { sentAt: 'asc' } } },
        });
    }
    async findThreadWithAccess(threadId, userId) {
        const thread = await this.prisma.messageThread.findUnique({
            where: { id: threadId },
            include: { listing: true },
        });
        if (!thread)
            throw new common_1.NotFoundException('Thread not found');
        if (thread.renterId !== userId && thread.listing.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this thread');
        }
        return thread;
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map