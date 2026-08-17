import { Prisma } from '../../generated/prisma/client';

export interface BookingPricing {
  subtotal: Prisma.Decimal;
  serviceFee: Prisma.Decimal;
  tax: Prisma.Decimal;
  total: Prisma.Decimal;
}

const SERVICE_FEE_RATE = '0.10';
const TAX_RATE = '0.08';

export function calculateBookingPricing(
  pricePerDay: Prisma.Decimal | number | string,
  nights: number,
): BookingPricing {
  const subtotal = new Prisma.Decimal(pricePerDay).mul(nights);
  const serviceFee = subtotal.mul(SERVICE_FEE_RATE);
  const tax = subtotal.plus(serviceFee).mul(TAX_RATE);
  const total = subtotal.plus(serviceFee).plus(tax);
  return { subtotal, serviceFee, tax, total };
}
