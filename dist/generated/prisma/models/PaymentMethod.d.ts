import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PaymentMethodModel = runtime.Types.Result.DefaultSelection<Prisma.$PaymentMethodPayload>;
export type AggregatePaymentMethod = {
    _count: PaymentMethodCountAggregateOutputType | null;
    _min: PaymentMethodMinAggregateOutputType | null;
    _max: PaymentMethodMaxAggregateOutputType | null;
};
export type PaymentMethodMinAggregateOutputType = {
    id: string | null;
    brand: $Enums.CardBrand | null;
    last4: string | null;
    expires: string | null;
    processorPaymentMethodId: string | null;
    userId: string | null;
};
export type PaymentMethodMaxAggregateOutputType = {
    id: string | null;
    brand: $Enums.CardBrand | null;
    last4: string | null;
    expires: string | null;
    processorPaymentMethodId: string | null;
    userId: string | null;
};
export type PaymentMethodCountAggregateOutputType = {
    id: number;
    brand: number;
    last4: number;
    expires: number;
    processorPaymentMethodId: number;
    userId: number;
    _all: number;
};
export type PaymentMethodMinAggregateInputType = {
    id?: true;
    brand?: true;
    last4?: true;
    expires?: true;
    processorPaymentMethodId?: true;
    userId?: true;
};
export type PaymentMethodMaxAggregateInputType = {
    id?: true;
    brand?: true;
    last4?: true;
    expires?: true;
    processorPaymentMethodId?: true;
    userId?: true;
};
export type PaymentMethodCountAggregateInputType = {
    id?: true;
    brand?: true;
    last4?: true;
    expires?: true;
    processorPaymentMethodId?: true;
    userId?: true;
    _all?: true;
};
export type PaymentMethodAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentMethodWhereInput;
    orderBy?: Prisma.PaymentMethodOrderByWithRelationInput | Prisma.PaymentMethodOrderByWithRelationInput[];
    cursor?: Prisma.PaymentMethodWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PaymentMethodCountAggregateInputType;
    _min?: PaymentMethodMinAggregateInputType;
    _max?: PaymentMethodMaxAggregateInputType;
};
export type GetPaymentMethodAggregateType<T extends PaymentMethodAggregateArgs> = {
    [P in keyof T & keyof AggregatePaymentMethod]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePaymentMethod[P]> : Prisma.GetScalarType<T[P], AggregatePaymentMethod[P]>;
};
export type PaymentMethodGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentMethodWhereInput;
    orderBy?: Prisma.PaymentMethodOrderByWithAggregationInput | Prisma.PaymentMethodOrderByWithAggregationInput[];
    by: Prisma.PaymentMethodScalarFieldEnum[] | Prisma.PaymentMethodScalarFieldEnum;
    having?: Prisma.PaymentMethodScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PaymentMethodCountAggregateInputType | true;
    _min?: PaymentMethodMinAggregateInputType;
    _max?: PaymentMethodMaxAggregateInputType;
};
export type PaymentMethodGroupByOutputType = {
    id: string;
    brand: $Enums.CardBrand;
    last4: string;
    expires: string;
    processorPaymentMethodId: string;
    userId: string;
    _count: PaymentMethodCountAggregateOutputType | null;
    _min: PaymentMethodMinAggregateOutputType | null;
    _max: PaymentMethodMaxAggregateOutputType | null;
};
export type GetPaymentMethodGroupByPayload<T extends PaymentMethodGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PaymentMethodGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PaymentMethodGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PaymentMethodGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PaymentMethodGroupByOutputType[P]>;
}>>;
export type PaymentMethodWhereInput = {
    AND?: Prisma.PaymentMethodWhereInput | Prisma.PaymentMethodWhereInput[];
    OR?: Prisma.PaymentMethodWhereInput[];
    NOT?: Prisma.PaymentMethodWhereInput | Prisma.PaymentMethodWhereInput[];
    id?: Prisma.StringFilter<"PaymentMethod"> | string;
    brand?: Prisma.EnumCardBrandFilter<"PaymentMethod"> | $Enums.CardBrand;
    last4?: Prisma.StringFilter<"PaymentMethod"> | string;
    expires?: Prisma.StringFilter<"PaymentMethod"> | string;
    processorPaymentMethodId?: Prisma.StringFilter<"PaymentMethod"> | string;
    userId?: Prisma.StringFilter<"PaymentMethod"> | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    bookings?: Prisma.BookingListRelationFilter;
};
export type PaymentMethodOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    brand?: Prisma.SortOrder;
    last4?: Prisma.SortOrder;
    expires?: Prisma.SortOrder;
    processorPaymentMethodId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    bookings?: Prisma.BookingOrderByRelationAggregateInput;
};
export type PaymentMethodWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    processorPaymentMethodId?: string;
    AND?: Prisma.PaymentMethodWhereInput | Prisma.PaymentMethodWhereInput[];
    OR?: Prisma.PaymentMethodWhereInput[];
    NOT?: Prisma.PaymentMethodWhereInput | Prisma.PaymentMethodWhereInput[];
    brand?: Prisma.EnumCardBrandFilter<"PaymentMethod"> | $Enums.CardBrand;
    last4?: Prisma.StringFilter<"PaymentMethod"> | string;
    expires?: Prisma.StringFilter<"PaymentMethod"> | string;
    userId?: Prisma.StringFilter<"PaymentMethod"> | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    bookings?: Prisma.BookingListRelationFilter;
}, "id" | "processorPaymentMethodId">;
export type PaymentMethodOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    brand?: Prisma.SortOrder;
    last4?: Prisma.SortOrder;
    expires?: Prisma.SortOrder;
    processorPaymentMethodId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    _count?: Prisma.PaymentMethodCountOrderByAggregateInput;
    _max?: Prisma.PaymentMethodMaxOrderByAggregateInput;
    _min?: Prisma.PaymentMethodMinOrderByAggregateInput;
};
export type PaymentMethodScalarWhereWithAggregatesInput = {
    AND?: Prisma.PaymentMethodScalarWhereWithAggregatesInput | Prisma.PaymentMethodScalarWhereWithAggregatesInput[];
    OR?: Prisma.PaymentMethodScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PaymentMethodScalarWhereWithAggregatesInput | Prisma.PaymentMethodScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PaymentMethod"> | string;
    brand?: Prisma.EnumCardBrandWithAggregatesFilter<"PaymentMethod"> | $Enums.CardBrand;
    last4?: Prisma.StringWithAggregatesFilter<"PaymentMethod"> | string;
    expires?: Prisma.StringWithAggregatesFilter<"PaymentMethod"> | string;
    processorPaymentMethodId?: Prisma.StringWithAggregatesFilter<"PaymentMethod"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"PaymentMethod"> | string;
};
export type PaymentMethodCreateInput = {
    id?: string;
    brand: $Enums.CardBrand;
    last4: string;
    expires: string;
    processorPaymentMethodId: string;
    user: Prisma.UserCreateNestedOneWithoutPaymentMethodsInput;
    bookings?: Prisma.BookingCreateNestedManyWithoutPaymentMethodInput;
};
export type PaymentMethodUncheckedCreateInput = {
    id?: string;
    brand: $Enums.CardBrand;
    last4: string;
    expires: string;
    processorPaymentMethodId: string;
    userId: string;
    bookings?: Prisma.BookingUncheckedCreateNestedManyWithoutPaymentMethodInput;
};
export type PaymentMethodUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.EnumCardBrandFieldUpdateOperationsInput | $Enums.CardBrand;
    last4?: Prisma.StringFieldUpdateOperationsInput | string;
    expires?: Prisma.StringFieldUpdateOperationsInput | string;
    processorPaymentMethodId?: Prisma.StringFieldUpdateOperationsInput | string;
    user?: Prisma.UserUpdateOneRequiredWithoutPaymentMethodsNestedInput;
    bookings?: Prisma.BookingUpdateManyWithoutPaymentMethodNestedInput;
};
export type PaymentMethodUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.EnumCardBrandFieldUpdateOperationsInput | $Enums.CardBrand;
    last4?: Prisma.StringFieldUpdateOperationsInput | string;
    expires?: Prisma.StringFieldUpdateOperationsInput | string;
    processorPaymentMethodId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    bookings?: Prisma.BookingUncheckedUpdateManyWithoutPaymentMethodNestedInput;
};
export type PaymentMethodCreateManyInput = {
    id?: string;
    brand: $Enums.CardBrand;
    last4: string;
    expires: string;
    processorPaymentMethodId: string;
    userId: string;
};
export type PaymentMethodUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.EnumCardBrandFieldUpdateOperationsInput | $Enums.CardBrand;
    last4?: Prisma.StringFieldUpdateOperationsInput | string;
    expires?: Prisma.StringFieldUpdateOperationsInput | string;
    processorPaymentMethodId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PaymentMethodUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.EnumCardBrandFieldUpdateOperationsInput | $Enums.CardBrand;
    last4?: Prisma.StringFieldUpdateOperationsInput | string;
    expires?: Prisma.StringFieldUpdateOperationsInput | string;
    processorPaymentMethodId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PaymentMethodListRelationFilter = {
    every?: Prisma.PaymentMethodWhereInput;
    some?: Prisma.PaymentMethodWhereInput;
    none?: Prisma.PaymentMethodWhereInput;
};
export type PaymentMethodOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PaymentMethodScalarRelationFilter = {
    is?: Prisma.PaymentMethodWhereInput;
    isNot?: Prisma.PaymentMethodWhereInput;
};
export type PaymentMethodCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    brand?: Prisma.SortOrder;
    last4?: Prisma.SortOrder;
    expires?: Prisma.SortOrder;
    processorPaymentMethodId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type PaymentMethodMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    brand?: Prisma.SortOrder;
    last4?: Prisma.SortOrder;
    expires?: Prisma.SortOrder;
    processorPaymentMethodId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type PaymentMethodMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    brand?: Prisma.SortOrder;
    last4?: Prisma.SortOrder;
    expires?: Prisma.SortOrder;
    processorPaymentMethodId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type PaymentMethodCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.PaymentMethodCreateWithoutUserInput, Prisma.PaymentMethodUncheckedCreateWithoutUserInput> | Prisma.PaymentMethodCreateWithoutUserInput[] | Prisma.PaymentMethodUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PaymentMethodCreateOrConnectWithoutUserInput | Prisma.PaymentMethodCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.PaymentMethodCreateManyUserInputEnvelope;
    connect?: Prisma.PaymentMethodWhereUniqueInput | Prisma.PaymentMethodWhereUniqueInput[];
};
export type PaymentMethodUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.PaymentMethodCreateWithoutUserInput, Prisma.PaymentMethodUncheckedCreateWithoutUserInput> | Prisma.PaymentMethodCreateWithoutUserInput[] | Prisma.PaymentMethodUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PaymentMethodCreateOrConnectWithoutUserInput | Prisma.PaymentMethodCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.PaymentMethodCreateManyUserInputEnvelope;
    connect?: Prisma.PaymentMethodWhereUniqueInput | Prisma.PaymentMethodWhereUniqueInput[];
};
export type PaymentMethodUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentMethodCreateWithoutUserInput, Prisma.PaymentMethodUncheckedCreateWithoutUserInput> | Prisma.PaymentMethodCreateWithoutUserInput[] | Prisma.PaymentMethodUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PaymentMethodCreateOrConnectWithoutUserInput | Prisma.PaymentMethodCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.PaymentMethodUpsertWithWhereUniqueWithoutUserInput | Prisma.PaymentMethodUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.PaymentMethodCreateManyUserInputEnvelope;
    set?: Prisma.PaymentMethodWhereUniqueInput | Prisma.PaymentMethodWhereUniqueInput[];
    disconnect?: Prisma.PaymentMethodWhereUniqueInput | Prisma.PaymentMethodWhereUniqueInput[];
    delete?: Prisma.PaymentMethodWhereUniqueInput | Prisma.PaymentMethodWhereUniqueInput[];
    connect?: Prisma.PaymentMethodWhereUniqueInput | Prisma.PaymentMethodWhereUniqueInput[];
    update?: Prisma.PaymentMethodUpdateWithWhereUniqueWithoutUserInput | Prisma.PaymentMethodUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.PaymentMethodUpdateManyWithWhereWithoutUserInput | Prisma.PaymentMethodUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.PaymentMethodScalarWhereInput | Prisma.PaymentMethodScalarWhereInput[];
};
export type PaymentMethodUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentMethodCreateWithoutUserInput, Prisma.PaymentMethodUncheckedCreateWithoutUserInput> | Prisma.PaymentMethodCreateWithoutUserInput[] | Prisma.PaymentMethodUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PaymentMethodCreateOrConnectWithoutUserInput | Prisma.PaymentMethodCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.PaymentMethodUpsertWithWhereUniqueWithoutUserInput | Prisma.PaymentMethodUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.PaymentMethodCreateManyUserInputEnvelope;
    set?: Prisma.PaymentMethodWhereUniqueInput | Prisma.PaymentMethodWhereUniqueInput[];
    disconnect?: Prisma.PaymentMethodWhereUniqueInput | Prisma.PaymentMethodWhereUniqueInput[];
    delete?: Prisma.PaymentMethodWhereUniqueInput | Prisma.PaymentMethodWhereUniqueInput[];
    connect?: Prisma.PaymentMethodWhereUniqueInput | Prisma.PaymentMethodWhereUniqueInput[];
    update?: Prisma.PaymentMethodUpdateWithWhereUniqueWithoutUserInput | Prisma.PaymentMethodUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.PaymentMethodUpdateManyWithWhereWithoutUserInput | Prisma.PaymentMethodUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.PaymentMethodScalarWhereInput | Prisma.PaymentMethodScalarWhereInput[];
};
export type PaymentMethodCreateNestedOneWithoutBookingsInput = {
    create?: Prisma.XOR<Prisma.PaymentMethodCreateWithoutBookingsInput, Prisma.PaymentMethodUncheckedCreateWithoutBookingsInput>;
    connectOrCreate?: Prisma.PaymentMethodCreateOrConnectWithoutBookingsInput;
    connect?: Prisma.PaymentMethodWhereUniqueInput;
};
export type PaymentMethodUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentMethodCreateWithoutBookingsInput, Prisma.PaymentMethodUncheckedCreateWithoutBookingsInput>;
    connectOrCreate?: Prisma.PaymentMethodCreateOrConnectWithoutBookingsInput;
    upsert?: Prisma.PaymentMethodUpsertWithoutBookingsInput;
    connect?: Prisma.PaymentMethodWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PaymentMethodUpdateToOneWithWhereWithoutBookingsInput, Prisma.PaymentMethodUpdateWithoutBookingsInput>, Prisma.PaymentMethodUncheckedUpdateWithoutBookingsInput>;
};
export type EnumCardBrandFieldUpdateOperationsInput = {
    set?: $Enums.CardBrand;
};
export type PaymentMethodCreateWithoutUserInput = {
    id?: string;
    brand: $Enums.CardBrand;
    last4: string;
    expires: string;
    processorPaymentMethodId: string;
    bookings?: Prisma.BookingCreateNestedManyWithoutPaymentMethodInput;
};
export type PaymentMethodUncheckedCreateWithoutUserInput = {
    id?: string;
    brand: $Enums.CardBrand;
    last4: string;
    expires: string;
    processorPaymentMethodId: string;
    bookings?: Prisma.BookingUncheckedCreateNestedManyWithoutPaymentMethodInput;
};
export type PaymentMethodCreateOrConnectWithoutUserInput = {
    where: Prisma.PaymentMethodWhereUniqueInput;
    create: Prisma.XOR<Prisma.PaymentMethodCreateWithoutUserInput, Prisma.PaymentMethodUncheckedCreateWithoutUserInput>;
};
export type PaymentMethodCreateManyUserInputEnvelope = {
    data: Prisma.PaymentMethodCreateManyUserInput | Prisma.PaymentMethodCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type PaymentMethodUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.PaymentMethodWhereUniqueInput;
    update: Prisma.XOR<Prisma.PaymentMethodUpdateWithoutUserInput, Prisma.PaymentMethodUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.PaymentMethodCreateWithoutUserInput, Prisma.PaymentMethodUncheckedCreateWithoutUserInput>;
};
export type PaymentMethodUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.PaymentMethodWhereUniqueInput;
    data: Prisma.XOR<Prisma.PaymentMethodUpdateWithoutUserInput, Prisma.PaymentMethodUncheckedUpdateWithoutUserInput>;
};
export type PaymentMethodUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.PaymentMethodScalarWhereInput;
    data: Prisma.XOR<Prisma.PaymentMethodUpdateManyMutationInput, Prisma.PaymentMethodUncheckedUpdateManyWithoutUserInput>;
};
export type PaymentMethodScalarWhereInput = {
    AND?: Prisma.PaymentMethodScalarWhereInput | Prisma.PaymentMethodScalarWhereInput[];
    OR?: Prisma.PaymentMethodScalarWhereInput[];
    NOT?: Prisma.PaymentMethodScalarWhereInput | Prisma.PaymentMethodScalarWhereInput[];
    id?: Prisma.StringFilter<"PaymentMethod"> | string;
    brand?: Prisma.EnumCardBrandFilter<"PaymentMethod"> | $Enums.CardBrand;
    last4?: Prisma.StringFilter<"PaymentMethod"> | string;
    expires?: Prisma.StringFilter<"PaymentMethod"> | string;
    processorPaymentMethodId?: Prisma.StringFilter<"PaymentMethod"> | string;
    userId?: Prisma.StringFilter<"PaymentMethod"> | string;
};
export type PaymentMethodCreateWithoutBookingsInput = {
    id?: string;
    brand: $Enums.CardBrand;
    last4: string;
    expires: string;
    processorPaymentMethodId: string;
    user: Prisma.UserCreateNestedOneWithoutPaymentMethodsInput;
};
export type PaymentMethodUncheckedCreateWithoutBookingsInput = {
    id?: string;
    brand: $Enums.CardBrand;
    last4: string;
    expires: string;
    processorPaymentMethodId: string;
    userId: string;
};
export type PaymentMethodCreateOrConnectWithoutBookingsInput = {
    where: Prisma.PaymentMethodWhereUniqueInput;
    create: Prisma.XOR<Prisma.PaymentMethodCreateWithoutBookingsInput, Prisma.PaymentMethodUncheckedCreateWithoutBookingsInput>;
};
export type PaymentMethodUpsertWithoutBookingsInput = {
    update: Prisma.XOR<Prisma.PaymentMethodUpdateWithoutBookingsInput, Prisma.PaymentMethodUncheckedUpdateWithoutBookingsInput>;
    create: Prisma.XOR<Prisma.PaymentMethodCreateWithoutBookingsInput, Prisma.PaymentMethodUncheckedCreateWithoutBookingsInput>;
    where?: Prisma.PaymentMethodWhereInput;
};
export type PaymentMethodUpdateToOneWithWhereWithoutBookingsInput = {
    where?: Prisma.PaymentMethodWhereInput;
    data: Prisma.XOR<Prisma.PaymentMethodUpdateWithoutBookingsInput, Prisma.PaymentMethodUncheckedUpdateWithoutBookingsInput>;
};
export type PaymentMethodUpdateWithoutBookingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.EnumCardBrandFieldUpdateOperationsInput | $Enums.CardBrand;
    last4?: Prisma.StringFieldUpdateOperationsInput | string;
    expires?: Prisma.StringFieldUpdateOperationsInput | string;
    processorPaymentMethodId?: Prisma.StringFieldUpdateOperationsInput | string;
    user?: Prisma.UserUpdateOneRequiredWithoutPaymentMethodsNestedInput;
};
export type PaymentMethodUncheckedUpdateWithoutBookingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.EnumCardBrandFieldUpdateOperationsInput | $Enums.CardBrand;
    last4?: Prisma.StringFieldUpdateOperationsInput | string;
    expires?: Prisma.StringFieldUpdateOperationsInput | string;
    processorPaymentMethodId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PaymentMethodCreateManyUserInput = {
    id?: string;
    brand: $Enums.CardBrand;
    last4: string;
    expires: string;
    processorPaymentMethodId: string;
};
export type PaymentMethodUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.EnumCardBrandFieldUpdateOperationsInput | $Enums.CardBrand;
    last4?: Prisma.StringFieldUpdateOperationsInput | string;
    expires?: Prisma.StringFieldUpdateOperationsInput | string;
    processorPaymentMethodId?: Prisma.StringFieldUpdateOperationsInput | string;
    bookings?: Prisma.BookingUpdateManyWithoutPaymentMethodNestedInput;
};
export type PaymentMethodUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.EnumCardBrandFieldUpdateOperationsInput | $Enums.CardBrand;
    last4?: Prisma.StringFieldUpdateOperationsInput | string;
    expires?: Prisma.StringFieldUpdateOperationsInput | string;
    processorPaymentMethodId?: Prisma.StringFieldUpdateOperationsInput | string;
    bookings?: Prisma.BookingUncheckedUpdateManyWithoutPaymentMethodNestedInput;
};
export type PaymentMethodUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.EnumCardBrandFieldUpdateOperationsInput | $Enums.CardBrand;
    last4?: Prisma.StringFieldUpdateOperationsInput | string;
    expires?: Prisma.StringFieldUpdateOperationsInput | string;
    processorPaymentMethodId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PaymentMethodCountOutputType = {
    bookings: number;
};
export type PaymentMethodCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    bookings?: boolean | PaymentMethodCountOutputTypeCountBookingsArgs;
};
export type PaymentMethodCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentMethodCountOutputTypeSelect<ExtArgs> | null;
};
export type PaymentMethodCountOutputTypeCountBookingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BookingWhereInput;
};
export type PaymentMethodSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    brand?: boolean;
    last4?: boolean;
    expires?: boolean;
    processorPaymentMethodId?: boolean;
    userId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    bookings?: boolean | Prisma.PaymentMethod$bookingsArgs<ExtArgs>;
    _count?: boolean | Prisma.PaymentMethodCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["paymentMethod"]>;
export type PaymentMethodSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    brand?: boolean;
    last4?: boolean;
    expires?: boolean;
    processorPaymentMethodId?: boolean;
    userId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["paymentMethod"]>;
export type PaymentMethodSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    brand?: boolean;
    last4?: boolean;
    expires?: boolean;
    processorPaymentMethodId?: boolean;
    userId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["paymentMethod"]>;
export type PaymentMethodSelectScalar = {
    id?: boolean;
    brand?: boolean;
    last4?: boolean;
    expires?: boolean;
    processorPaymentMethodId?: boolean;
    userId?: boolean;
};
export type PaymentMethodOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "brand" | "last4" | "expires" | "processorPaymentMethodId" | "userId", ExtArgs["result"]["paymentMethod"]>;
export type PaymentMethodInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    bookings?: boolean | Prisma.PaymentMethod$bookingsArgs<ExtArgs>;
    _count?: boolean | Prisma.PaymentMethodCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PaymentMethodIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PaymentMethodIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $PaymentMethodPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PaymentMethod";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        bookings: Prisma.$BookingPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        brand: $Enums.CardBrand;
        last4: string;
        expires: string;
        processorPaymentMethodId: string;
        userId: string;
    }, ExtArgs["result"]["paymentMethod"]>;
    composites: {};
};
export type PaymentMethodGetPayload<S extends boolean | null | undefined | PaymentMethodDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PaymentMethodPayload, S>;
export type PaymentMethodCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PaymentMethodFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PaymentMethodCountAggregateInputType | true;
};
export interface PaymentMethodDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PaymentMethod'];
        meta: {
            name: 'PaymentMethod';
        };
    };
    findUnique<T extends PaymentMethodFindUniqueArgs>(args: Prisma.SelectSubset<T, PaymentMethodFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$PaymentMethodPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PaymentMethodFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PaymentMethodFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$PaymentMethodPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PaymentMethodFindFirstArgs>(args?: Prisma.SelectSubset<T, PaymentMethodFindFirstArgs<ExtArgs>>): Prisma.Prisma__PaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$PaymentMethodPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PaymentMethodFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PaymentMethodFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$PaymentMethodPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PaymentMethodFindManyArgs>(args?: Prisma.SelectSubset<T, PaymentMethodFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentMethodPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PaymentMethodCreateArgs>(args: Prisma.SelectSubset<T, PaymentMethodCreateArgs<ExtArgs>>): Prisma.Prisma__PaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$PaymentMethodPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PaymentMethodCreateManyArgs>(args?: Prisma.SelectSubset<T, PaymentMethodCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PaymentMethodCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PaymentMethodCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentMethodPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PaymentMethodDeleteArgs>(args: Prisma.SelectSubset<T, PaymentMethodDeleteArgs<ExtArgs>>): Prisma.Prisma__PaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$PaymentMethodPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PaymentMethodUpdateArgs>(args: Prisma.SelectSubset<T, PaymentMethodUpdateArgs<ExtArgs>>): Prisma.Prisma__PaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$PaymentMethodPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PaymentMethodDeleteManyArgs>(args?: Prisma.SelectSubset<T, PaymentMethodDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PaymentMethodUpdateManyArgs>(args: Prisma.SelectSubset<T, PaymentMethodUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PaymentMethodUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PaymentMethodUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentMethodPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PaymentMethodUpsertArgs>(args: Prisma.SelectSubset<T, PaymentMethodUpsertArgs<ExtArgs>>): Prisma.Prisma__PaymentMethodClient<runtime.Types.Result.GetResult<Prisma.$PaymentMethodPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PaymentMethodCountArgs>(args?: Prisma.Subset<T, PaymentMethodCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PaymentMethodCountAggregateOutputType> : number>;
    aggregate<T extends PaymentMethodAggregateArgs>(args: Prisma.Subset<T, PaymentMethodAggregateArgs>): Prisma.PrismaPromise<GetPaymentMethodAggregateType<T>>;
    groupBy<T extends PaymentMethodGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PaymentMethodGroupByArgs['orderBy'];
    } : {
        orderBy?: PaymentMethodGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PaymentMethodGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentMethodGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PaymentMethodFieldRefs;
}
export interface Prisma__PaymentMethodClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    bookings<T extends Prisma.PaymentMethod$bookingsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PaymentMethod$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PaymentMethodFieldRefs {
    readonly id: Prisma.FieldRef<"PaymentMethod", 'String'>;
    readonly brand: Prisma.FieldRef<"PaymentMethod", 'CardBrand'>;
    readonly last4: Prisma.FieldRef<"PaymentMethod", 'String'>;
    readonly expires: Prisma.FieldRef<"PaymentMethod", 'String'>;
    readonly processorPaymentMethodId: Prisma.FieldRef<"PaymentMethod", 'String'>;
    readonly userId: Prisma.FieldRef<"PaymentMethod", 'String'>;
}
export type PaymentMethodFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.PaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.PaymentMethodInclude<ExtArgs> | null;
    where: Prisma.PaymentMethodWhereUniqueInput;
};
export type PaymentMethodFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.PaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.PaymentMethodInclude<ExtArgs> | null;
    where: Prisma.PaymentMethodWhereUniqueInput;
};
export type PaymentMethodFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.PaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.PaymentMethodInclude<ExtArgs> | null;
    where?: Prisma.PaymentMethodWhereInput;
    orderBy?: Prisma.PaymentMethodOrderByWithRelationInput | Prisma.PaymentMethodOrderByWithRelationInput[];
    cursor?: Prisma.PaymentMethodWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PaymentMethodScalarFieldEnum | Prisma.PaymentMethodScalarFieldEnum[];
};
export type PaymentMethodFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.PaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.PaymentMethodInclude<ExtArgs> | null;
    where?: Prisma.PaymentMethodWhereInput;
    orderBy?: Prisma.PaymentMethodOrderByWithRelationInput | Prisma.PaymentMethodOrderByWithRelationInput[];
    cursor?: Prisma.PaymentMethodWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PaymentMethodScalarFieldEnum | Prisma.PaymentMethodScalarFieldEnum[];
};
export type PaymentMethodFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.PaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.PaymentMethodInclude<ExtArgs> | null;
    where?: Prisma.PaymentMethodWhereInput;
    orderBy?: Prisma.PaymentMethodOrderByWithRelationInput | Prisma.PaymentMethodOrderByWithRelationInput[];
    cursor?: Prisma.PaymentMethodWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PaymentMethodScalarFieldEnum | Prisma.PaymentMethodScalarFieldEnum[];
};
export type PaymentMethodCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.PaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.PaymentMethodInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PaymentMethodCreateInput, Prisma.PaymentMethodUncheckedCreateInput>;
};
export type PaymentMethodCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PaymentMethodCreateManyInput | Prisma.PaymentMethodCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PaymentMethodCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentMethodSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PaymentMethodOmit<ExtArgs> | null;
    data: Prisma.PaymentMethodCreateManyInput | Prisma.PaymentMethodCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PaymentMethodIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PaymentMethodUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.PaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.PaymentMethodInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PaymentMethodUpdateInput, Prisma.PaymentMethodUncheckedUpdateInput>;
    where: Prisma.PaymentMethodWhereUniqueInput;
};
export type PaymentMethodUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PaymentMethodUpdateManyMutationInput, Prisma.PaymentMethodUncheckedUpdateManyInput>;
    where?: Prisma.PaymentMethodWhereInput;
    limit?: number;
};
export type PaymentMethodUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentMethodSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PaymentMethodOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PaymentMethodUpdateManyMutationInput, Prisma.PaymentMethodUncheckedUpdateManyInput>;
    where?: Prisma.PaymentMethodWhereInput;
    limit?: number;
    include?: Prisma.PaymentMethodIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PaymentMethodUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.PaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.PaymentMethodInclude<ExtArgs> | null;
    where: Prisma.PaymentMethodWhereUniqueInput;
    create: Prisma.XOR<Prisma.PaymentMethodCreateInput, Prisma.PaymentMethodUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PaymentMethodUpdateInput, Prisma.PaymentMethodUncheckedUpdateInput>;
};
export type PaymentMethodDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.PaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.PaymentMethodInclude<ExtArgs> | null;
    where: Prisma.PaymentMethodWhereUniqueInput;
};
export type PaymentMethodDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentMethodWhereInput;
    limit?: number;
};
export type PaymentMethod$bookingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingSelect<ExtArgs> | null;
    omit?: Prisma.BookingOmit<ExtArgs> | null;
    include?: Prisma.BookingInclude<ExtArgs> | null;
    where?: Prisma.BookingWhereInput;
    orderBy?: Prisma.BookingOrderByWithRelationInput | Prisma.BookingOrderByWithRelationInput[];
    cursor?: Prisma.BookingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BookingScalarFieldEnum | Prisma.BookingScalarFieldEnum[];
};
export type PaymentMethodDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentMethodSelect<ExtArgs> | null;
    omit?: Prisma.PaymentMethodOmit<ExtArgs> | null;
    include?: Prisma.PaymentMethodInclude<ExtArgs> | null;
};
