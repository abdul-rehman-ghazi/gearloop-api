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
                    name: string;
                    email: string;
                    passwordHash: string;
                    initials: string;
                    isOwner: boolean;
                    isSuspended: boolean;
                    memberSince: Date;
                    responseTime: string | null;
                };
            } & {
                id: string;
                title: string;
                category: import("../../generated/prisma/enums").ListingCategory;
                location: string;
                pricePerDay: import("@prisma/client-runtime-utils").Decimal;
                description: string;
                status: import("../../generated/prisma/enums").ListingStatus;
                createdAt: Date;
                ownerId: string;
            };
            renter: {
                id: string;
                name: string;
                email: string;
                passwordHash: string;
                initials: string;
                isOwner: boolean;
                isSuspended: boolean;
                memberSince: Date;
                responseTime: string | null;
            };
        } & {
            id: string;
            status: import("../../generated/prisma/enums").BookingStatus;
            createdAt: Date;
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
        detail: string;
        bookingId: string;
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
                    name: string;
                    email: string;
                    passwordHash: string;
                    initials: string;
                    isOwner: boolean;
                    isSuspended: boolean;
                    memberSince: Date;
                    responseTime: string | null;
                };
            } & {
                id: string;
                title: string;
                category: import("../../generated/prisma/enums").ListingCategory;
                location: string;
                pricePerDay: import("@prisma/client-runtime-utils").Decimal;
                description: string;
                status: import("../../generated/prisma/enums").ListingStatus;
                createdAt: Date;
                ownerId: string;
            };
            renter: {
                id: string;
                name: string;
                email: string;
                passwordHash: string;
                initials: string;
                isOwner: boolean;
                isSuspended: boolean;
                memberSince: Date;
                responseTime: string | null;
            };
        } & {
            id: string;
            status: import("../../generated/prisma/enums").BookingStatus;
            createdAt: Date;
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
        detail: string;
        bookingId: string;
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
        detail: string;
        bookingId: string;
    }>;
}
