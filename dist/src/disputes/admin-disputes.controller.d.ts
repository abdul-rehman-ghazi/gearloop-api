import { DisputesService } from './disputes.service';
import { UpdateDisputeStatusDto } from './dto/update-dispute-status.dto';
export declare class AdminDisputesController {
    private readonly disputesService;
    constructor(disputesService: DisputesService);
    findAll(): Promise<({
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
    findById(id: string): Promise<{
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
    updateStatus(id: string, dto: UpdateDisputeStatusDto): Promise<{
        id: string;
        status: import("../../generated/prisma/enums").DisputeStatus;
        bookingId: string;
        detail: string;
    }>;
}
