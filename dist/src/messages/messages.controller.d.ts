import { MessagesService } from './messages.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { SendMessageDto } from './dto/send-message.dto';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    createThread(user: UserAuthContext, dto: CreateThreadDto): Promise<{
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
    findThreads(user: UserAuthContext): Promise<({
        listing: {
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            title: string;
            category: import("../../generated/prisma/enums").ListingCategory;
            location: string;
            pricePerDay: import("@prisma/client-runtime-utils").Decimal;
            description: string;
            images: string[];
            status: import("../../generated/prisma/enums").ListingStatus;
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
    findThreadById(user: UserAuthContext, id: string): Promise<{
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
    sendMessage(user: UserAuthContext, id: string, dto: SendMessageDto): Promise<{
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
}
