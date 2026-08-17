import { ListingsService } from './listings.service';
export declare class AdminListingsController {
    private readonly listingsService;
    constructor(listingsService: ListingsService);
    approve(id: string): Promise<{
        id: string;
        title: string;
        category: import("../../generated/prisma/enums").ListingCategory;
        location: string;
        pricePerDay: import("@prisma/client-runtime-utils").Decimal;
        description: string;
        status: import("../../generated/prisma/enums").ListingStatus;
        createdAt: Date;
        ownerId: string;
    }>;
    reject(id: string): Promise<{
        id: string;
        title: string;
        category: import("../../generated/prisma/enums").ListingCategory;
        location: string;
        pricePerDay: import("@prisma/client-runtime-utils").Decimal;
        description: string;
        status: import("../../generated/prisma/enums").ListingStatus;
        createdAt: Date;
        ownerId: string;
    }>;
}
