import { PrismaService } from '../prisma/prisma.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeStatusDto } from './dto/update-dispute-status.dto';
export declare class DisputesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateDisputeDto): Promise<{
        id: string;
        status: import("../../generated/prisma/enums").DisputeStatus;
        detail: string;
        bookingId: string;
    }>;
    findAllForUser(userId: string): Promise<({
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
    findById(id: string, userId?: string): Promise<{
        booking: {
            listing: {
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
    updateStatus(id: string, dto: UpdateDisputeStatusDto): Promise<{
        id: string;
        status: import("../../generated/prisma/enums").DisputeStatus;
        detail: string;
        bookingId: string;
    }>;
}
