import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { CardBrand } from '../../../generated/prisma/enums';

// The real card number/CVV never reaches this API — the client tokenizes
// the card with the payment processor first (e.g. Stripe Elements) and
// sends us the resulting token plus display metadata.
export class CreatePaymentMethodDto {
  @IsEnum(CardBrand)
  brand: CardBrand;

  @IsString()
  @Length(4, 4)
  last4: string;

  @IsString()
  @IsNotEmpty()
  expires: string;

  @IsString()
  @IsNotEmpty()
  processorPaymentMethodId: string;
}
