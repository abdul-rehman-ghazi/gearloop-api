import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ListingModel = runtime.Types.Result.DefaultSelection<Prisma.$ListingPayload>;
export type AggregateListing = {
    _count: ListingCountAggregateOutputType | null;
    _avg: ListingAvgAggregateOutputType | null;
    _sum: ListingSumAggregateOutputType | null;
    _min: ListingMinAggregateOutputType | null;
    _max: ListingMaxAggregateOutputType | null;
};
export type ListingAvgAggregateOutputType = {
    pricePerDay: runtime.Decimal | null;
};
export type ListingSumAggregateOutputType = {
    pricePerDay: runtime.Decimal | null;
};
export type ListingMinAggregateOutputType = {
    id: string | null;
    title: string | null;
    category: $Enums.ListingCategory | null;
    location: string | null;
    pricePerDay: runtime.Decimal | null;
    description: string | null;
    status: $Enums.ListingStatus | null;
    createdAt: Date | null;
    deletedAt: Date | null;
    ownerId: string | null;
};
export type ListingMaxAggregateOutputType = {
    id: string | null;
    title: string | null;
    category: $Enums.ListingCategory | null;
    location: string | null;
    pricePerDay: runtime.Decimal | null;
    description: string | null;
    status: $Enums.ListingStatus | null;
    createdAt: Date | null;
    deletedAt: Date | null;
    ownerId: string | null;
};
export type ListingCountAggregateOutputType = {
    id: number;
    title: number;
    category: number;
    location: number;
    pricePerDay: number;
    description: number;
    images: number;
    status: number;
    createdAt: number;
    deletedAt: number;
    ownerId: number;
    _all: number;
};
export type ListingAvgAggregateInputType = {
    pricePerDay?: true;
};
export type ListingSumAggregateInputType = {
    pricePerDay?: true;
};
export type ListingMinAggregateInputType = {
    id?: true;
    title?: true;
    category?: true;
    location?: true;
    pricePerDay?: true;
    description?: true;
    status?: true;
    createdAt?: true;
    deletedAt?: true;
    ownerId?: true;
};
export type ListingMaxAggregateInputType = {
    id?: true;
    title?: true;
    category?: true;
    location?: true;
    pricePerDay?: true;
    description?: true;
    status?: true;
    createdAt?: true;
    deletedAt?: true;
    ownerId?: true;
};
export type ListingCountAggregateInputType = {
    id?: true;
    title?: true;
    category?: true;
    location?: true;
    pricePerDay?: true;
    description?: true;
    images?: true;
    status?: true;
    createdAt?: true;
    deletedAt?: true;
    ownerId?: true;
    _all?: true;
};
export type ListingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListingWhereInput;
    orderBy?: Prisma.ListingOrderByWithRelationInput | Prisma.ListingOrderByWithRelationInput[];
    cursor?: Prisma.ListingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ListingCountAggregateInputType;
    _avg?: ListingAvgAggregateInputType;
    _sum?: ListingSumAggregateInputType;
    _min?: ListingMinAggregateInputType;
    _max?: ListingMaxAggregateInputType;
};
export type GetListingAggregateType<T extends ListingAggregateArgs> = {
    [P in keyof T & keyof AggregateListing]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateListing[P]> : Prisma.GetScalarType<T[P], AggregateListing[P]>;
};
export type ListingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListingWhereInput;
    orderBy?: Prisma.ListingOrderByWithAggregationInput | Prisma.ListingOrderByWithAggregationInput[];
    by: Prisma.ListingScalarFieldEnum[] | Prisma.ListingScalarFieldEnum;
    having?: Prisma.ListingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ListingCountAggregateInputType | true;
    _avg?: ListingAvgAggregateInputType;
    _sum?: ListingSumAggregateInputType;
    _min?: ListingMinAggregateInputType;
    _max?: ListingMaxAggregateInputType;
};
export type ListingGroupByOutputType = {
    id: string;
    title: string;
    category: $Enums.ListingCategory;
    location: string;
    pricePerDay: runtime.Decimal;
    description: string;
    images: string[];
    status: $Enums.ListingStatus;
    createdAt: Date;
    deletedAt: Date | null;
    ownerId: string;
    _count: ListingCountAggregateOutputType | null;
    _avg: ListingAvgAggregateOutputType | null;
    _sum: ListingSumAggregateOutputType | null;
    _min: ListingMinAggregateOutputType | null;
    _max: ListingMaxAggregateOutputType | null;
};
export type GetListingGroupByPayload<T extends ListingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ListingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ListingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ListingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ListingGroupByOutputType[P]>;
}>>;
export type ListingWhereInput = {
    AND?: Prisma.ListingWhereInput | Prisma.ListingWhereInput[];
    OR?: Prisma.ListingWhereInput[];
    NOT?: Prisma.ListingWhereInput | Prisma.ListingWhereInput[];
    id?: Prisma.StringFilter<"Listing"> | string;
    title?: Prisma.StringFilter<"Listing"> | string;
    category?: Prisma.EnumListingCategoryFilter<"Listing"> | $Enums.ListingCategory;
    location?: Prisma.StringFilter<"Listing"> | string;
    pricePerDay?: Prisma.DecimalFilter<"Listing"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFilter<"Listing"> | string;
    images?: Prisma.StringNullableListFilter<"Listing">;
    status?: Prisma.EnumListingStatusFilter<"Listing"> | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeFilter<"Listing"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Listing"> | Date | string | null;
    ownerId?: Prisma.StringFilter<"Listing"> | string;
    owner?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    bookings?: Prisma.BookingListRelationFilter;
    threads?: Prisma.MessageThreadListRelationFilter;
};
export type ListingOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    pricePerDay?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    images?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    owner?: Prisma.UserOrderByWithRelationInput;
    bookings?: Prisma.BookingOrderByRelationAggregateInput;
    threads?: Prisma.MessageThreadOrderByRelationAggregateInput;
};
export type ListingWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ListingWhereInput | Prisma.ListingWhereInput[];
    OR?: Prisma.ListingWhereInput[];
    NOT?: Prisma.ListingWhereInput | Prisma.ListingWhereInput[];
    title?: Prisma.StringFilter<"Listing"> | string;
    category?: Prisma.EnumListingCategoryFilter<"Listing"> | $Enums.ListingCategory;
    location?: Prisma.StringFilter<"Listing"> | string;
    pricePerDay?: Prisma.DecimalFilter<"Listing"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFilter<"Listing"> | string;
    images?: Prisma.StringNullableListFilter<"Listing">;
    status?: Prisma.EnumListingStatusFilter<"Listing"> | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeFilter<"Listing"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Listing"> | Date | string | null;
    ownerId?: Prisma.StringFilter<"Listing"> | string;
    owner?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    bookings?: Prisma.BookingListRelationFilter;
    threads?: Prisma.MessageThreadListRelationFilter;
}, "id">;
export type ListingOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    pricePerDay?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    images?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    _count?: Prisma.ListingCountOrderByAggregateInput;
    _avg?: Prisma.ListingAvgOrderByAggregateInput;
    _max?: Prisma.ListingMaxOrderByAggregateInput;
    _min?: Prisma.ListingMinOrderByAggregateInput;
    _sum?: Prisma.ListingSumOrderByAggregateInput;
};
export type ListingScalarWhereWithAggregatesInput = {
    AND?: Prisma.ListingScalarWhereWithAggregatesInput | Prisma.ListingScalarWhereWithAggregatesInput[];
    OR?: Prisma.ListingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ListingScalarWhereWithAggregatesInput | Prisma.ListingScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Listing"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Listing"> | string;
    category?: Prisma.EnumListingCategoryWithAggregatesFilter<"Listing"> | $Enums.ListingCategory;
    location?: Prisma.StringWithAggregatesFilter<"Listing"> | string;
    pricePerDay?: Prisma.DecimalWithAggregatesFilter<"Listing"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringWithAggregatesFilter<"Listing"> | string;
    images?: Prisma.StringNullableListFilter<"Listing">;
    status?: Prisma.EnumListingStatusWithAggregatesFilter<"Listing"> | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Listing"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Listing"> | Date | string | null;
    ownerId?: Prisma.StringWithAggregatesFilter<"Listing"> | string;
};
export type ListingCreateInput = {
    id?: string;
    title: string;
    category: $Enums.ListingCategory;
    location: string;
    pricePerDay: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    images?: Prisma.ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    owner: Prisma.UserCreateNestedOneWithoutListingsInput;
    bookings?: Prisma.BookingCreateNestedManyWithoutListingInput;
    threads?: Prisma.MessageThreadCreateNestedManyWithoutListingInput;
};
export type ListingUncheckedCreateInput = {
    id?: string;
    title: string;
    category: $Enums.ListingCategory;
    location: string;
    pricePerDay: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    images?: Prisma.ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    ownerId: string;
    bookings?: Prisma.BookingUncheckedCreateNestedManyWithoutListingInput;
    threads?: Prisma.MessageThreadUncheckedCreateNestedManyWithoutListingInput;
};
export type ListingUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumListingCategoryFieldUpdateOperationsInput | $Enums.ListingCategory;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    pricePerDay?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    images?: Prisma.ListingUpdateimagesInput | string[];
    status?: Prisma.EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    owner?: Prisma.UserUpdateOneRequiredWithoutListingsNestedInput;
    bookings?: Prisma.BookingUpdateManyWithoutListingNestedInput;
    threads?: Prisma.MessageThreadUpdateManyWithoutListingNestedInput;
};
export type ListingUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumListingCategoryFieldUpdateOperationsInput | $Enums.ListingCategory;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    pricePerDay?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    images?: Prisma.ListingUpdateimagesInput | string[];
    status?: Prisma.EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    bookings?: Prisma.BookingUncheckedUpdateManyWithoutListingNestedInput;
    threads?: Prisma.MessageThreadUncheckedUpdateManyWithoutListingNestedInput;
};
export type ListingCreateManyInput = {
    id?: string;
    title: string;
    category: $Enums.ListingCategory;
    location: string;
    pricePerDay: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    images?: Prisma.ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    ownerId: string;
};
export type ListingUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumListingCategoryFieldUpdateOperationsInput | $Enums.ListingCategory;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    pricePerDay?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    images?: Prisma.ListingUpdateimagesInput | string[];
    status?: Prisma.EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ListingUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumListingCategoryFieldUpdateOperationsInput | $Enums.ListingCategory;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    pricePerDay?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    images?: Prisma.ListingUpdateimagesInput | string[];
    status?: Prisma.EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ListingListRelationFilter = {
    every?: Prisma.ListingWhereInput;
    some?: Prisma.ListingWhereInput;
    none?: Prisma.ListingWhereInput;
};
export type ListingOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
};
export type ListingCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    pricePerDay?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    images?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
};
export type ListingAvgOrderByAggregateInput = {
    pricePerDay?: Prisma.SortOrder;
};
export type ListingMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    pricePerDay?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
};
export type ListingMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    pricePerDay?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
};
export type ListingSumOrderByAggregateInput = {
    pricePerDay?: Prisma.SortOrder;
};
export type ListingScalarRelationFilter = {
    is?: Prisma.ListingWhereInput;
    isNot?: Prisma.ListingWhereInput;
};
export type ListingCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.ListingCreateWithoutOwnerInput, Prisma.ListingUncheckedCreateWithoutOwnerInput> | Prisma.ListingCreateWithoutOwnerInput[] | Prisma.ListingUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.ListingCreateOrConnectWithoutOwnerInput | Prisma.ListingCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.ListingCreateManyOwnerInputEnvelope;
    connect?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
};
export type ListingUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.ListingCreateWithoutOwnerInput, Prisma.ListingUncheckedCreateWithoutOwnerInput> | Prisma.ListingCreateWithoutOwnerInput[] | Prisma.ListingUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.ListingCreateOrConnectWithoutOwnerInput | Prisma.ListingCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.ListingCreateManyOwnerInputEnvelope;
    connect?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
};
export type ListingUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.ListingCreateWithoutOwnerInput, Prisma.ListingUncheckedCreateWithoutOwnerInput> | Prisma.ListingCreateWithoutOwnerInput[] | Prisma.ListingUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.ListingCreateOrConnectWithoutOwnerInput | Prisma.ListingCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.ListingUpsertWithWhereUniqueWithoutOwnerInput | Prisma.ListingUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.ListingCreateManyOwnerInputEnvelope;
    set?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    disconnect?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    delete?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    connect?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    update?: Prisma.ListingUpdateWithWhereUniqueWithoutOwnerInput | Prisma.ListingUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.ListingUpdateManyWithWhereWithoutOwnerInput | Prisma.ListingUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.ListingScalarWhereInput | Prisma.ListingScalarWhereInput[];
};
export type ListingUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.ListingCreateWithoutOwnerInput, Prisma.ListingUncheckedCreateWithoutOwnerInput> | Prisma.ListingCreateWithoutOwnerInput[] | Prisma.ListingUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.ListingCreateOrConnectWithoutOwnerInput | Prisma.ListingCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.ListingUpsertWithWhereUniqueWithoutOwnerInput | Prisma.ListingUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.ListingCreateManyOwnerInputEnvelope;
    set?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    disconnect?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    delete?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    connect?: Prisma.ListingWhereUniqueInput | Prisma.ListingWhereUniqueInput[];
    update?: Prisma.ListingUpdateWithWhereUniqueWithoutOwnerInput | Prisma.ListingUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.ListingUpdateManyWithWhereWithoutOwnerInput | Prisma.ListingUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.ListingScalarWhereInput | Prisma.ListingScalarWhereInput[];
};
export type ListingCreateimagesInput = {
    set: string[];
};
export type EnumListingCategoryFieldUpdateOperationsInput = {
    set?: $Enums.ListingCategory;
};
export type DecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ListingUpdateimagesInput = {
    set?: string[];
    push?: string | string[];
};
export type EnumListingStatusFieldUpdateOperationsInput = {
    set?: $Enums.ListingStatus;
};
export type ListingCreateNestedOneWithoutBookingsInput = {
    create?: Prisma.XOR<Prisma.ListingCreateWithoutBookingsInput, Prisma.ListingUncheckedCreateWithoutBookingsInput>;
    connectOrCreate?: Prisma.ListingCreateOrConnectWithoutBookingsInput;
    connect?: Prisma.ListingWhereUniqueInput;
};
export type ListingUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: Prisma.XOR<Prisma.ListingCreateWithoutBookingsInput, Prisma.ListingUncheckedCreateWithoutBookingsInput>;
    connectOrCreate?: Prisma.ListingCreateOrConnectWithoutBookingsInput;
    upsert?: Prisma.ListingUpsertWithoutBookingsInput;
    connect?: Prisma.ListingWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ListingUpdateToOneWithWhereWithoutBookingsInput, Prisma.ListingUpdateWithoutBookingsInput>, Prisma.ListingUncheckedUpdateWithoutBookingsInput>;
};
export type ListingCreateNestedOneWithoutThreadsInput = {
    create?: Prisma.XOR<Prisma.ListingCreateWithoutThreadsInput, Prisma.ListingUncheckedCreateWithoutThreadsInput>;
    connectOrCreate?: Prisma.ListingCreateOrConnectWithoutThreadsInput;
    connect?: Prisma.ListingWhereUniqueInput;
};
export type ListingUpdateOneRequiredWithoutThreadsNestedInput = {
    create?: Prisma.XOR<Prisma.ListingCreateWithoutThreadsInput, Prisma.ListingUncheckedCreateWithoutThreadsInput>;
    connectOrCreate?: Prisma.ListingCreateOrConnectWithoutThreadsInput;
    upsert?: Prisma.ListingUpsertWithoutThreadsInput;
    connect?: Prisma.ListingWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ListingUpdateToOneWithWhereWithoutThreadsInput, Prisma.ListingUpdateWithoutThreadsInput>, Prisma.ListingUncheckedUpdateWithoutThreadsInput>;
};
export type ListingCreateWithoutOwnerInput = {
    id?: string;
    title: string;
    category: $Enums.ListingCategory;
    location: string;
    pricePerDay: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    images?: Prisma.ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    bookings?: Prisma.BookingCreateNestedManyWithoutListingInput;
    threads?: Prisma.MessageThreadCreateNestedManyWithoutListingInput;
};
export type ListingUncheckedCreateWithoutOwnerInput = {
    id?: string;
    title: string;
    category: $Enums.ListingCategory;
    location: string;
    pricePerDay: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    images?: Prisma.ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    bookings?: Prisma.BookingUncheckedCreateNestedManyWithoutListingInput;
    threads?: Prisma.MessageThreadUncheckedCreateNestedManyWithoutListingInput;
};
export type ListingCreateOrConnectWithoutOwnerInput = {
    where: Prisma.ListingWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListingCreateWithoutOwnerInput, Prisma.ListingUncheckedCreateWithoutOwnerInput>;
};
export type ListingCreateManyOwnerInputEnvelope = {
    data: Prisma.ListingCreateManyOwnerInput | Prisma.ListingCreateManyOwnerInput[];
    skipDuplicates?: boolean;
};
export type ListingUpsertWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.ListingWhereUniqueInput;
    update: Prisma.XOR<Prisma.ListingUpdateWithoutOwnerInput, Prisma.ListingUncheckedUpdateWithoutOwnerInput>;
    create: Prisma.XOR<Prisma.ListingCreateWithoutOwnerInput, Prisma.ListingUncheckedCreateWithoutOwnerInput>;
};
export type ListingUpdateWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.ListingWhereUniqueInput;
    data: Prisma.XOR<Prisma.ListingUpdateWithoutOwnerInput, Prisma.ListingUncheckedUpdateWithoutOwnerInput>;
};
export type ListingUpdateManyWithWhereWithoutOwnerInput = {
    where: Prisma.ListingScalarWhereInput;
    data: Prisma.XOR<Prisma.ListingUpdateManyMutationInput, Prisma.ListingUncheckedUpdateManyWithoutOwnerInput>;
};
export type ListingScalarWhereInput = {
    AND?: Prisma.ListingScalarWhereInput | Prisma.ListingScalarWhereInput[];
    OR?: Prisma.ListingScalarWhereInput[];
    NOT?: Prisma.ListingScalarWhereInput | Prisma.ListingScalarWhereInput[];
    id?: Prisma.StringFilter<"Listing"> | string;
    title?: Prisma.StringFilter<"Listing"> | string;
    category?: Prisma.EnumListingCategoryFilter<"Listing"> | $Enums.ListingCategory;
    location?: Prisma.StringFilter<"Listing"> | string;
    pricePerDay?: Prisma.DecimalFilter<"Listing"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFilter<"Listing"> | string;
    images?: Prisma.StringNullableListFilter<"Listing">;
    status?: Prisma.EnumListingStatusFilter<"Listing"> | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeFilter<"Listing"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Listing"> | Date | string | null;
    ownerId?: Prisma.StringFilter<"Listing"> | string;
};
export type ListingCreateWithoutBookingsInput = {
    id?: string;
    title: string;
    category: $Enums.ListingCategory;
    location: string;
    pricePerDay: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    images?: Prisma.ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    owner: Prisma.UserCreateNestedOneWithoutListingsInput;
    threads?: Prisma.MessageThreadCreateNestedManyWithoutListingInput;
};
export type ListingUncheckedCreateWithoutBookingsInput = {
    id?: string;
    title: string;
    category: $Enums.ListingCategory;
    location: string;
    pricePerDay: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    images?: Prisma.ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    ownerId: string;
    threads?: Prisma.MessageThreadUncheckedCreateNestedManyWithoutListingInput;
};
export type ListingCreateOrConnectWithoutBookingsInput = {
    where: Prisma.ListingWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListingCreateWithoutBookingsInput, Prisma.ListingUncheckedCreateWithoutBookingsInput>;
};
export type ListingUpsertWithoutBookingsInput = {
    update: Prisma.XOR<Prisma.ListingUpdateWithoutBookingsInput, Prisma.ListingUncheckedUpdateWithoutBookingsInput>;
    create: Prisma.XOR<Prisma.ListingCreateWithoutBookingsInput, Prisma.ListingUncheckedCreateWithoutBookingsInput>;
    where?: Prisma.ListingWhereInput;
};
export type ListingUpdateToOneWithWhereWithoutBookingsInput = {
    where?: Prisma.ListingWhereInput;
    data: Prisma.XOR<Prisma.ListingUpdateWithoutBookingsInput, Prisma.ListingUncheckedUpdateWithoutBookingsInput>;
};
export type ListingUpdateWithoutBookingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumListingCategoryFieldUpdateOperationsInput | $Enums.ListingCategory;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    pricePerDay?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    images?: Prisma.ListingUpdateimagesInput | string[];
    status?: Prisma.EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    owner?: Prisma.UserUpdateOneRequiredWithoutListingsNestedInput;
    threads?: Prisma.MessageThreadUpdateManyWithoutListingNestedInput;
};
export type ListingUncheckedUpdateWithoutBookingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumListingCategoryFieldUpdateOperationsInput | $Enums.ListingCategory;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    pricePerDay?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    images?: Prisma.ListingUpdateimagesInput | string[];
    status?: Prisma.EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    threads?: Prisma.MessageThreadUncheckedUpdateManyWithoutListingNestedInput;
};
export type ListingCreateWithoutThreadsInput = {
    id?: string;
    title: string;
    category: $Enums.ListingCategory;
    location: string;
    pricePerDay: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    images?: Prisma.ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    owner: Prisma.UserCreateNestedOneWithoutListingsInput;
    bookings?: Prisma.BookingCreateNestedManyWithoutListingInput;
};
export type ListingUncheckedCreateWithoutThreadsInput = {
    id?: string;
    title: string;
    category: $Enums.ListingCategory;
    location: string;
    pricePerDay: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    images?: Prisma.ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    ownerId: string;
    bookings?: Prisma.BookingUncheckedCreateNestedManyWithoutListingInput;
};
export type ListingCreateOrConnectWithoutThreadsInput = {
    where: Prisma.ListingWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListingCreateWithoutThreadsInput, Prisma.ListingUncheckedCreateWithoutThreadsInput>;
};
export type ListingUpsertWithoutThreadsInput = {
    update: Prisma.XOR<Prisma.ListingUpdateWithoutThreadsInput, Prisma.ListingUncheckedUpdateWithoutThreadsInput>;
    create: Prisma.XOR<Prisma.ListingCreateWithoutThreadsInput, Prisma.ListingUncheckedCreateWithoutThreadsInput>;
    where?: Prisma.ListingWhereInput;
};
export type ListingUpdateToOneWithWhereWithoutThreadsInput = {
    where?: Prisma.ListingWhereInput;
    data: Prisma.XOR<Prisma.ListingUpdateWithoutThreadsInput, Prisma.ListingUncheckedUpdateWithoutThreadsInput>;
};
export type ListingUpdateWithoutThreadsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumListingCategoryFieldUpdateOperationsInput | $Enums.ListingCategory;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    pricePerDay?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    images?: Prisma.ListingUpdateimagesInput | string[];
    status?: Prisma.EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    owner?: Prisma.UserUpdateOneRequiredWithoutListingsNestedInput;
    bookings?: Prisma.BookingUpdateManyWithoutListingNestedInput;
};
export type ListingUncheckedUpdateWithoutThreadsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumListingCategoryFieldUpdateOperationsInput | $Enums.ListingCategory;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    pricePerDay?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    images?: Prisma.ListingUpdateimagesInput | string[];
    status?: Prisma.EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    bookings?: Prisma.BookingUncheckedUpdateManyWithoutListingNestedInput;
};
export type ListingCreateManyOwnerInput = {
    id?: string;
    title: string;
    category: $Enums.ListingCategory;
    location: string;
    pricePerDay: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    images?: Prisma.ListingCreateimagesInput | string[];
    status?: $Enums.ListingStatus;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type ListingUpdateWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumListingCategoryFieldUpdateOperationsInput | $Enums.ListingCategory;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    pricePerDay?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    images?: Prisma.ListingUpdateimagesInput | string[];
    status?: Prisma.EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bookings?: Prisma.BookingUpdateManyWithoutListingNestedInput;
    threads?: Prisma.MessageThreadUpdateManyWithoutListingNestedInput;
};
export type ListingUncheckedUpdateWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumListingCategoryFieldUpdateOperationsInput | $Enums.ListingCategory;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    pricePerDay?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    images?: Prisma.ListingUpdateimagesInput | string[];
    status?: Prisma.EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bookings?: Prisma.BookingUncheckedUpdateManyWithoutListingNestedInput;
    threads?: Prisma.MessageThreadUncheckedUpdateManyWithoutListingNestedInput;
};
export type ListingUncheckedUpdateManyWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumListingCategoryFieldUpdateOperationsInput | $Enums.ListingCategory;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    pricePerDay?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    images?: Prisma.ListingUpdateimagesInput | string[];
    status?: Prisma.EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ListingCountOutputType = {
    bookings: number;
    threads: number;
};
export type ListingCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    bookings?: boolean | ListingCountOutputTypeCountBookingsArgs;
    threads?: boolean | ListingCountOutputTypeCountThreadsArgs;
};
export type ListingCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingCountOutputTypeSelect<ExtArgs> | null;
};
export type ListingCountOutputTypeCountBookingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BookingWhereInput;
};
export type ListingCountOutputTypeCountThreadsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageThreadWhereInput;
};
export type ListingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    category?: boolean;
    location?: boolean;
    pricePerDay?: boolean;
    description?: boolean;
    images?: boolean;
    status?: boolean;
    createdAt?: boolean;
    deletedAt?: boolean;
    ownerId?: boolean;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    bookings?: boolean | Prisma.Listing$bookingsArgs<ExtArgs>;
    threads?: boolean | Prisma.Listing$threadsArgs<ExtArgs>;
    _count?: boolean | Prisma.ListingCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["listing"]>;
export type ListingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    category?: boolean;
    location?: boolean;
    pricePerDay?: boolean;
    description?: boolean;
    images?: boolean;
    status?: boolean;
    createdAt?: boolean;
    deletedAt?: boolean;
    ownerId?: boolean;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["listing"]>;
export type ListingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    category?: boolean;
    location?: boolean;
    pricePerDay?: boolean;
    description?: boolean;
    images?: boolean;
    status?: boolean;
    createdAt?: boolean;
    deletedAt?: boolean;
    ownerId?: boolean;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["listing"]>;
export type ListingSelectScalar = {
    id?: boolean;
    title?: boolean;
    category?: boolean;
    location?: boolean;
    pricePerDay?: boolean;
    description?: boolean;
    images?: boolean;
    status?: boolean;
    createdAt?: boolean;
    deletedAt?: boolean;
    ownerId?: boolean;
};
export type ListingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "title" | "category" | "location" | "pricePerDay" | "description" | "images" | "status" | "createdAt" | "deletedAt" | "ownerId", ExtArgs["result"]["listing"]>;
export type ListingInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    bookings?: boolean | Prisma.Listing$bookingsArgs<ExtArgs>;
    threads?: boolean | Prisma.Listing$threadsArgs<ExtArgs>;
    _count?: boolean | Prisma.ListingCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ListingIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ListingIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $ListingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Listing";
    objects: {
        owner: Prisma.$UserPayload<ExtArgs>;
        bookings: Prisma.$BookingPayload<ExtArgs>[];
        threads: Prisma.$MessageThreadPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        title: string;
        category: $Enums.ListingCategory;
        location: string;
        pricePerDay: runtime.Decimal;
        description: string;
        images: string[];
        status: $Enums.ListingStatus;
        createdAt: Date;
        deletedAt: Date | null;
        ownerId: string;
    }, ExtArgs["result"]["listing"]>;
    composites: {};
};
export type ListingGetPayload<S extends boolean | null | undefined | ListingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ListingPayload, S>;
export type ListingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ListingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ListingCountAggregateInputType | true;
};
export interface ListingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Listing'];
        meta: {
            name: 'Listing';
        };
    };
    findUnique<T extends ListingFindUniqueArgs>(args: Prisma.SelectSubset<T, ListingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ListingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ListingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ListingFindFirstArgs>(args?: Prisma.SelectSubset<T, ListingFindFirstArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ListingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ListingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ListingFindManyArgs>(args?: Prisma.SelectSubset<T, ListingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ListingCreateArgs>(args: Prisma.SelectSubset<T, ListingCreateArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ListingCreateManyArgs>(args?: Prisma.SelectSubset<T, ListingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ListingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ListingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ListingDeleteArgs>(args: Prisma.SelectSubset<T, ListingDeleteArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ListingUpdateArgs>(args: Prisma.SelectSubset<T, ListingUpdateArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ListingDeleteManyArgs>(args?: Prisma.SelectSubset<T, ListingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ListingUpdateManyArgs>(args: Prisma.SelectSubset<T, ListingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ListingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ListingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ListingUpsertArgs>(args: Prisma.SelectSubset<T, ListingUpsertArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ListingCountArgs>(args?: Prisma.Subset<T, ListingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ListingCountAggregateOutputType> : number>;
    aggregate<T extends ListingAggregateArgs>(args: Prisma.Subset<T, ListingAggregateArgs>): Prisma.PrismaPromise<GetListingAggregateType<T>>;
    groupBy<T extends ListingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ListingGroupByArgs['orderBy'];
    } : {
        orderBy?: ListingGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ListingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ListingFieldRefs;
}
export interface Prisma__ListingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    owner<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    bookings<T extends Prisma.Listing$bookingsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Listing$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    threads<T extends Prisma.Listing$threadsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Listing$threadsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ListingFieldRefs {
    readonly id: Prisma.FieldRef<"Listing", 'String'>;
    readonly title: Prisma.FieldRef<"Listing", 'String'>;
    readonly category: Prisma.FieldRef<"Listing", 'ListingCategory'>;
    readonly location: Prisma.FieldRef<"Listing", 'String'>;
    readonly pricePerDay: Prisma.FieldRef<"Listing", 'Decimal'>;
    readonly description: Prisma.FieldRef<"Listing", 'String'>;
    readonly images: Prisma.FieldRef<"Listing", 'String[]'>;
    readonly status: Prisma.FieldRef<"Listing", 'ListingStatus'>;
    readonly createdAt: Prisma.FieldRef<"Listing", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"Listing", 'DateTime'>;
    readonly ownerId: Prisma.FieldRef<"Listing", 'String'>;
}
export type ListingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where: Prisma.ListingWhereUniqueInput;
};
export type ListingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where: Prisma.ListingWhereUniqueInput;
};
export type ListingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where?: Prisma.ListingWhereInput;
    orderBy?: Prisma.ListingOrderByWithRelationInput | Prisma.ListingOrderByWithRelationInput[];
    cursor?: Prisma.ListingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ListingScalarFieldEnum | Prisma.ListingScalarFieldEnum[];
};
export type ListingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where?: Prisma.ListingWhereInput;
    orderBy?: Prisma.ListingOrderByWithRelationInput | Prisma.ListingOrderByWithRelationInput[];
    cursor?: Prisma.ListingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ListingScalarFieldEnum | Prisma.ListingScalarFieldEnum[];
};
export type ListingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where?: Prisma.ListingWhereInput;
    orderBy?: Prisma.ListingOrderByWithRelationInput | Prisma.ListingOrderByWithRelationInput[];
    cursor?: Prisma.ListingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ListingScalarFieldEnum | Prisma.ListingScalarFieldEnum[];
};
export type ListingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListingCreateInput, Prisma.ListingUncheckedCreateInput>;
};
export type ListingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ListingCreateManyInput | Prisma.ListingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ListingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    data: Prisma.ListingCreateManyInput | Prisma.ListingCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ListingIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ListingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListingUpdateInput, Prisma.ListingUncheckedUpdateInput>;
    where: Prisma.ListingWhereUniqueInput;
};
export type ListingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ListingUpdateManyMutationInput, Prisma.ListingUncheckedUpdateManyInput>;
    where?: Prisma.ListingWhereInput;
    limit?: number;
};
export type ListingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListingUpdateManyMutationInput, Prisma.ListingUncheckedUpdateManyInput>;
    where?: Prisma.ListingWhereInput;
    limit?: number;
    include?: Prisma.ListingIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ListingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where: Prisma.ListingWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListingCreateInput, Prisma.ListingUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ListingUpdateInput, Prisma.ListingUncheckedUpdateInput>;
};
export type ListingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where: Prisma.ListingWhereUniqueInput;
};
export type ListingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListingWhereInput;
    limit?: number;
};
export type Listing$bookingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Listing$threadsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageThreadSelect<ExtArgs> | null;
    omit?: Prisma.MessageThreadOmit<ExtArgs> | null;
    include?: Prisma.MessageThreadInclude<ExtArgs> | null;
    where?: Prisma.MessageThreadWhereInput;
    orderBy?: Prisma.MessageThreadOrderByWithRelationInput | Prisma.MessageThreadOrderByWithRelationInput[];
    cursor?: Prisma.MessageThreadWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MessageThreadScalarFieldEnum | Prisma.MessageThreadScalarFieldEnum[];
};
export type ListingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
};
