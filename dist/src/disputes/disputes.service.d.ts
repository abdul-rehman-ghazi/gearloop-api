import { PrismaService } from '../prisma/prisma.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeStatusDto } from './dto/update-dispute-status.dto';
export declare class DisputesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateDisputeDto): Promise<{
        id: string;
        status: import("../../generated/prisma/enums").DisputeStatus;
        bookingId: string;
        detail: string;
    }>;
    findAllForUser(userId: string): Promise<({
        booking: {
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            status: import("../../generated/prisma/enums").BookingStatus;
            requestNumber: string;
            startDate: Date;
            endDate: Date;
            pickupMethod: import("../../generated/prisma/enums").PickupMethod;
            payoutStatus: import("../../generated/prisma/enums").PayoutStatus | null;
            pricePerDayAtBooking: import("@prisma/client-runtime-utils").Decimal;
            nights: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            serviceFee: import("@prisma/client-runtime-utils").Decimal;
            tax: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            listingId: string;
            renterId: string;
            paymentMethodId: string;
        };
    } & {
        id: string;
        status: import("../../generated/prisma/enums").DisputeStatus;
        bookingId: string;
        detail: string;
    })[]>;
    findById(id: string, userId?: string): Promise<{
        booking: {
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
        } & {
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            status: import("../../generated/prisma/enums").BookingStatus;
            requestNumber: string;
            startDate: Date;
            endDate: Date;
            pickupMethod: import("../../generated/prisma/enums").PickupMethod;
            payoutStatus: import("../../generated/prisma/enums").PayoutStatus | null;
            pricePerDayAtBooking: import("@prisma/client-runtime-utils").Decimal;
            nights: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            serviceFee: import("@prisma/client-runtime-utils").Decimal;
            tax: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            listingId: string;
            renterId: string;
            paymentMethodId: string;
        };
    } & {
        id: string;
        status: import("../../generated/prisma/enums").DisputeStatus;
        bookingId: string;
        detail: string;
    }>;
    updateStatus(id: string, dto: UpdateDisputeStatusDto): Promise<{
        id: string;
        status: import("../../generated/prisma/enums").DisputeStatus;
        bookingId: string;
        detail: string;
    }>;
    findAllForAdmin(): Promise<({
        booking: {
            listing: {
                owner: {
                    id: string;
                    email: string;
                    name: string;
                    passwordHash: string;
                    initials: string;
                    isOwner: boolean;
                    isSuspended: boolean;
                    memberSince: Date;
                    responseTime: string | null;
                    deletedAt: Date | null;
                };
            } & {
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
            renter: {
                id: string;
                email: string;
                name: string;
                passwordHash: string;
                initials: string;
                isOwner: boolean;
                isSuspended: boolean;
                memberSince: Date;
                responseTime: string | null;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            status: import("../../generated/prisma/enums").BookingStatus;
            requestNumber: string;
            startDate: Date;
            endDate: Date;
            pickupMethod: import("../../generated/prisma/enums").PickupMethod;
            payoutStatus: import("../../generated/prisma/enums").PayoutStatus | null;
            pricePerDayAtBooking: import("@prisma/client-runtime-utils").Decimal;
            nights: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            serviceFee: import("@prisma/client-runtime-utils").Decimal;
            tax: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            listingId: string;
            renterId: string;
            paymentMethodId: string;
        };
    } & {
        id: string;
        status: import("../../generated/prisma/enums").DisputeStatus;
        bookingId: string;
        detail: string;
    } & {
        booking: {
            renter: {
                [key: string]: unknown;
            };
            listing: {
                owner: {
                    [key: string]: unknown;
                };
            };
        };
    })[]>;
    findByIdForAdmin(id: string): Promise<{
        booking: {
            listing: {
                owner: {
                    id: string;
                    email: string;
                    name: string;
                    passwordHash: string;
                    initials: string;
                    isOwner: boolean;
                    isSuspended: boolean;
                    memberSince: Date;
                    responseTime: string | null;
                    deletedAt: Date | null;
                };
            } & {
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
            renter: {
                id: string;
                email: string;
                name: string;
                passwordHash: string;
                initials: string;
                isOwner: boolean;
                isSuspended: boolean;
                memberSince: Date;
                responseTime: string | null;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            status: import("../../generated/prisma/enums").BookingStatus;
            requestNumber: string;
            startDate: Date;
            endDate: Date;
            pickupMethod: import("../../generated/prisma/enums").PickupMethod;
            payoutStatus: import("../../generated/prisma/enums").PayoutStatus | null;
            pricePerDayAtBooking: import("@prisma/client-runtime-utils").Decimal;
            nights: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            serviceFee: import("@prisma/client-runtime-utils").Decimal;
            tax: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            listingId: string;
            renterId: string;
            paymentMethodId: string;
        };
    } & {
        id: string;
        status: import("../../generated/prisma/enums").DisputeStatus;
        bookingId: string;
        detail: string;
    } & {
        booking: {
            renter: {
                [key: string]: unknown;
            };
            listing: {
                owner: {
                    [key: string]: unknown;
                };
            };
        };
    }>;
    private sanitizeForAdmin;
}
