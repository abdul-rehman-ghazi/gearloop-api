import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';
export declare class PaymentMethodsController {
    private readonly paymentMethodsService;
    constructor(paymentMethodsService: PaymentMethodsService);
    create(user: UserAuthContext, dto: CreatePaymentMethodDto): import("../../generated/prisma/models").Prisma__PaymentMethodClient<{
        id: string;
        processorPaymentMethodId: string;
        brand: import("../../generated/prisma/enums").CardBrand;
        last4: string;
        expires: string;
        userId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    findAll(user: UserAuthContext): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        processorPaymentMethodId: string;
        brand: import("../../generated/prisma/enums").CardBrand;
        last4: string;
        expires: string;
        userId: string;
    }[]>;
    findById(user: UserAuthContext, id: string): Promise<{
        id: string;
        processorPaymentMethodId: string;
        brand: import("../../generated/prisma/enums").CardBrand;
        last4: string;
        expires: string;
        userId: string;
    }>;
    remove(user: UserAuthContext, id: string): Promise<void>;
}
