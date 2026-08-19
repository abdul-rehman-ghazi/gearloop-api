import { AdminService } from './admin.service';
import { ListingStatus } from '../../generated/prisma/enums';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    findAllUsers(): Promise<{
        id: string;
        name: string;
        email: string;
        initials: string;
        isOwner: boolean;
        isSuspended: boolean;
        memberSince: Date;
        responseTime: string | null;
    }[]>;
    suspendUser(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        initials: string;
        isOwner: boolean;
        isSuspended: boolean;
        memberSince: Date;
        responseTime: string | null;
    }>;
    reinstateUser(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        initials: string;
        isOwner: boolean;
        isSuspended: boolean;
        memberSince: Date;
        responseTime: string | null;
    }>;
    deleteUser(id: string): Promise<void>;
    findAllBookings(): Promise<{
        renter: {
            id: string;
            name: string;
            email: string;
            initials: string;
            isOwner: boolean;
            isSuspended: boolean;
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
            status: ListingStatus;
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
    findAllListings(status?: ListingStatus): Promise<{
        owner: {
            id: string;
            name: string;
            email: string;
            initials: string;
            isOwner: boolean;
            isSuspended: boolean;
            memberSince: Date;
            responseTime: string | null;
        };
        id: string;
        title: string;
        category: import("../../generated/prisma/enums").ListingCategory;
        location: string;
        pricePerDay: import("@prisma/client-runtime-utils").Decimal;
        description: string;
        status: ListingStatus;
        createdAt: Date;
        ownerId: string;
    }[]>;
    findListingById(id: string): Promise<{
        owner: {
            id: string;
            name: string;
            email: string;
            initials: string;
            isOwner: boolean;
            isSuspended: boolean;
            memberSince: Date;
            responseTime: string | null;
        };
        id: string;
        title: string;
        category: import("../../generated/prisma/enums").ListingCategory;
        location: string;
        pricePerDay: import("@prisma/client-runtime-utils").Decimal;
        description: string;
        status: ListingStatus;
        createdAt: Date;
        ownerId: string;
    }>;
    deleteListing(id: string): Promise<void>;
}
