import { BadRequestException } from '@nestjs/common';
import { assertDepositWithinCap } from './deposit-cap.util';

describe('assertDepositWithinCap', () => {
  it('accepts_a_deposit_of_exactly_100_times_the_daily_price', () => {
    expect(() => assertDepositWithinCap(750_000, 7_500)).not.toThrow();
  });

  it('accepts_no_deposit', () => {
    expect(() => assertDepositWithinCap(0, 25)).not.toThrow();
  });

  it('rejects_a_deposit_above_100_times_the_daily_price', () => {
    expect(() => assertDepositWithinCap(2_501, 25)).toThrow(
      BadRequestException,
    );
  });
});
