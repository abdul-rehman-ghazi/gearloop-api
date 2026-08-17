import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';
export declare class ListingsController {
    private readonly listingsService;
    constructor(listingsService: ListingsService);
    create(user: UserAuthContext, dto: CreateListingDto): Promise<{
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
    findAll(dto: SearchListingsDto, user?: UserAuthContext): Promise<{
        id: string;
        title: string;
        category: import("../../generated/prisma/enums").ListingCategory;
        location: string;
        pricePerDay: import("@prisma/client-runtime-utils").Decimal;
        description: string;
        status: import("../../generated/prisma/enums").ListingStatus;
        createdAt: Date;
        ownerId: string;
    }[]>;
    findById(id: string): Promise<{
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
    update(user: UserAuthContext, id: string, dto: UpdateListingDto): Promise<{
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
    pause(user: UserAuthContext, id: string): Promise<{
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
