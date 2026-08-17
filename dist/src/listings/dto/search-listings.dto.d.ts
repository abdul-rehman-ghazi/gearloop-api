import { ListingCategory } from '../../../generated/prisma/enums';
export declare class SearchListingsDto {
    category?: ListingCategory;
    location?: string;
    startDate?: string;
    endDate?: string;
}
