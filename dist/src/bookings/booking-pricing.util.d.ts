import { Prisma } from '../../generated/prisma/client';
export interface BookingPricing {
    subtotal: Prisma.Decimal;
    serviceFee: Prisma.Decimal;
    tax: Prisma.Decimal;
    total: Prisma.Decimal;
}
export declare function calculateBookingPricing(pricePerDay: Prisma.Decimal | number | string, nights: number): BookingPricing;
