import { BadRequestException } from '@nestjs/common';

// A typo guard, not a business rule: an extra zero in the deposit would place
// a huge hold on a renter's card. Scaling with the daily price keeps the guard
// meaningful in every currency — the old flat 10,000 cap was generous in USD
// but blocked ordinary deposits in PKR.
export const MAX_DEPOSIT_TO_DAILY_PRICE = 100;

export function assertDepositWithinCap(
  depositAmount: number,
  pricePerDay: number,
): void {
  if (depositAmount <= pricePerDay * MAX_DEPOSIT_TO_DAILY_PRICE) return;
  throw new BadRequestException(
    `depositAmount cannot exceed ${MAX_DEPOSIT_TO_DAILY_PRICE}x the daily price`,
  );
}
