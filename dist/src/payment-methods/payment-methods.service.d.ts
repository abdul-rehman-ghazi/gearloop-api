import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { Prisma } from '../../generated/prisma/client';
export declare class PaymentMethodsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreatePaymentMethodDto): Prisma.Prisma__PaymentMethodClient<{
        id: string;
        processorPaymentMethodId: string;
        brand: import("../../generated/prisma/enums").CardBrand;
        last4: string;
        expires: string;
        userId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findAllForUser(userId: string): Prisma.PrismaPromise<{
        id: string;
        processorPaymentMethodId: string;
        brand: import("../../generated/prisma/enums").CardBrand;
        last4: string;
        expires: string;
        userId: string;
    }[]>;
    findById(id: string, userId: string): Promise<{
        id: string;
        processorPaymentMethodId: string;
        brand: import("../../generated/prisma/enums").CardBrand;
        last4: string;
        expires: string;
        userId: string;
    }>;
    remove(id: string, userId: string): Promise<void>;
}
