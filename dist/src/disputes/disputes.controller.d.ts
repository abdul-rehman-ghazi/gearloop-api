import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';
export declare class DisputesController {
    private readonly disputesService;
    constructor(disputesService: DisputesService);
    create(user: UserAuthContext, dto: CreateDisputeDto): Promise<{
        id: string;
        status: import("../../generated/prisma/enums").DisputeStatus;
        detail: string;
        bookingId: string;
    }>;
    findAll(user: UserAuthContext): Promise<({
        booking: {
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
    })[]>;
    findById(user: UserAuthContext, id: string): Promise<{
        booking: {
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
    }>;
}
