import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
export declare class ListingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(ownerId: string, dto: CreateListingDto): Promise<{
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
    findAll(dto: SearchListingsDto, callerUserId?: string): Promise<{
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
    update(id: string, ownerId: string, dto: UpdateListingDto): Promise<{
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
    pause(id: string, ownerId: string): Promise<{
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
    private assertOwnership;
}
