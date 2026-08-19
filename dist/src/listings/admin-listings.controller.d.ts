import { ListingsService } from './listings.service';
export declare class AdminListingsController {
    private readonly listingsService;
    constructor(listingsService: ListingsService);
    approve(id: string): Promise<{
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
    }>;
    reject(id: string): Promise<{
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
    }>;
}
