import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllUsers(): Promise<{
        id: string;
        name: string;
        email: string;
        initials: string;
        isOwner: boolean;
        memberSince: Date;
        responseTime: string | null;
    }[]>;
    findAllBookings(): Promise<{
        renter: {
            id: string;
            name: string;
            email: string;
            initials: string;
            isOwner: boolean;
            memberSince: Date;
            responseTime: string | null;
        };
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
    }[]>;
}
