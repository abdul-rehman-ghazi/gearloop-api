import { ListingCategory } from '../../../generated/prisma/enums';
export declare class CreateListingDto {
    title: string;
    category: ListingCategory;
    location: string;
    pricePerDay: number;
    description: string;
    images?: string[];
}
