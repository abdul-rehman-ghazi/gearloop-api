import { PickupMethod } from '../../../generated/prisma/enums';
export declare class CreateBookingDto {
    listingId: string;
    startDate: string;
    endDate: string;
    pickupMethod: PickupMethod;
    paymentMethodId: string;
}
