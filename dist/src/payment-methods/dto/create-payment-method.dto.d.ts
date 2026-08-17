import { CardBrand } from '../../../generated/prisma/enums';
export declare class CreatePaymentMethodDto {
    brand: CardBrand;
    last4: string;
    expires: string;
    processorPaymentMethodId: string;
}
