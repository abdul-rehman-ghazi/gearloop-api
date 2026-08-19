import { PrismaService } from '../prisma/prisma.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { SendMessageDto } from './dto/send-message.dto';
export declare class MessagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createThread(renterId: string, dto: CreateThreadDto): Promise<{
        messages: {
            id: string;
            text: string;
            sentAt: Date;
            threadId: string;
            senderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        listingId: string;
        renterId: string;
        unreadForRenter: boolean;
        unreadForOwner: boolean;
    }>;
    sendMessage(threadId: string, senderId: string, dto: SendMessageDto): Promise<{
        messages: {
            id: string;
            text: string;
            sentAt: Date;
            threadId: string;
            senderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        listingId: string;
        renterId: string;
        unreadForRenter: boolean;
        unreadForOwner: boolean;
    }>;
    findThreadsForUser(userId: string): Promise<({
        listing: {
            id: string;
            title: string;
            category: import("../../generated/prisma/enums").ListingCategory;
            location: string;
            pricePerDay: import("@prisma/client-runtime-utils").Decimal;
            description: string;
            images: string[];
            status: import("../../generated/prisma/enums").ListingStatus;
            createdAt: Date;
            ownerId: string;
        };
        messages: {
            id: string;
            text: string;
            sentAt: Date;
            threadId: string;
            senderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        listingId: string;
        renterId: string;
        unreadForRenter: boolean;
        unreadForOwner: boolean;
    })[]>;
    findThreadById(threadId: string, userId: string): Promise<{
        messages: {
            id: string;
            text: string;
            sentAt: Date;
            threadId: string;
            senderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        listingId: string;
        renterId: string;
        unreadForRenter: boolean;
        unreadForOwner: boolean;
    }>;
    private findThreadWithAccess;
}
