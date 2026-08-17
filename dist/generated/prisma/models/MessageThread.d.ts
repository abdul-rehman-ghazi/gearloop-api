import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type MessageThreadModel = runtime.Types.Result.DefaultSelection<Prisma.$MessageThreadPayload>;
export type AggregateMessageThread = {
    _count: MessageThreadCountAggregateOutputType | null;
    _min: MessageThreadMinAggregateOutputType | null;
    _max: MessageThreadMaxAggregateOutputType | null;
};
export type MessageThreadMinAggregateOutputType = {
    id: string | null;
    unreadForRenter: boolean | null;
    unreadForOwner: boolean | null;
    createdAt: Date | null;
    listingId: string | null;
    renterId: string | null;
};
export type MessageThreadMaxAggregateOutputType = {
    id: string | null;
    unreadForRenter: boolean | null;
    unreadForOwner: boolean | null;
    createdAt: Date | null;
    listingId: string | null;
    renterId: string | null;
};
export type MessageThreadCountAggregateOutputType = {
    id: number;
    unreadForRenter: number;
    unreadForOwner: number;
    createdAt: number;
    listingId: number;
    renterId: number;
    _all: number;
};
export type MessageThreadMinAggregateInputType = {
    id?: true;
    unreadForRenter?: true;
    unreadForOwner?: true;
    createdAt?: true;
    listingId?: true;
    renterId?: true;
};
export type MessageThreadMaxAggregateInputType = {
    id?: true;
    unreadForRenter?: true;
    unreadForOwner?: true;
    createdAt?: true;
    listingId?: true;
    renterId?: true;
};
export type MessageThreadCountAggregateInputType = {
    id?: true;
    unreadForRenter?: true;
    unreadForOwner?: true;
    createdAt?: true;
    listingId?: true;
    renterId?: true;
    _all?: true;
};
export type MessageThreadAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageThreadWhereInput;
    orderBy?: Prisma.MessageThreadOrderByWithRelationInput | Prisma.MessageThreadOrderByWithRelationInput[];
    cursor?: Prisma.MessageThreadWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MessageThreadCountAggregateInputType;
    _min?: MessageThreadMinAggregateInputType;
    _max?: MessageThreadMaxAggregateInputType;
};
export type GetMessageThreadAggregateType<T extends MessageThreadAggregateArgs> = {
    [P in keyof T & keyof AggregateMessageThread]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMessageThread[P]> : Prisma.GetScalarType<T[P], AggregateMessageThread[P]>;
};
export type MessageThreadGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageThreadWhereInput;
    orderBy?: Prisma.MessageThreadOrderByWithAggregationInput | Prisma.MessageThreadOrderByWithAggregationInput[];
    by: Prisma.MessageThreadScalarFieldEnum[] | Prisma.MessageThreadScalarFieldEnum;
    having?: Prisma.MessageThreadScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MessageThreadCountAggregateInputType | true;
    _min?: MessageThreadMinAggregateInputType;
    _max?: MessageThreadMaxAggregateInputType;
};
export type MessageThreadGroupByOutputType = {
    id: string;
    unreadForRenter: boolean;
    unreadForOwner: boolean;
    createdAt: Date;
    listingId: string;
    renterId: string;
    _count: MessageThreadCountAggregateOutputType | null;
    _min: MessageThreadMinAggregateOutputType | null;
    _max: MessageThreadMaxAggregateOutputType | null;
};
export type GetMessageThreadGroupByPayload<T extends MessageThreadGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MessageThreadGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MessageThreadGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MessageThreadGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MessageThreadGroupByOutputType[P]>;
}>>;
export type MessageThreadWhereInput = {
    AND?: Prisma.MessageThreadWhereInput | Prisma.MessageThreadWhereInput[];
    OR?: Prisma.MessageThreadWhereInput[];
    NOT?: Prisma.MessageThreadWhereInput | Prisma.MessageThreadWhereInput[];
    id?: Prisma.StringFilter<"MessageThread"> | string;
    unreadForRenter?: Prisma.BoolFilter<"MessageThread"> | boolean;
    unreadForOwner?: Prisma.BoolFilter<"MessageThread"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"MessageThread"> | Date | string;
    listingId?: Prisma.StringFilter<"MessageThread"> | string;
    renterId?: Prisma.StringFilter<"MessageThread"> | string;
    listing?: Prisma.XOR<Prisma.ListingScalarRelationFilter, Prisma.ListingWhereInput>;
    renter?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    messages?: Prisma.MessageListRelationFilter;
};
export type MessageThreadOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    unreadForRenter?: Prisma.SortOrder;
    unreadForOwner?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    renterId?: Prisma.SortOrder;
    listing?: Prisma.ListingOrderByWithRelationInput;
    renter?: Prisma.UserOrderByWithRelationInput;
    messages?: Prisma.MessageOrderByRelationAggregateInput;
};
export type MessageThreadWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.MessageThreadWhereInput | Prisma.MessageThreadWhereInput[];
    OR?: Prisma.MessageThreadWhereInput[];
    NOT?: Prisma.MessageThreadWhereInput | Prisma.MessageThreadWhereInput[];
    unreadForRenter?: Prisma.BoolFilter<"MessageThread"> | boolean;
    unreadForOwner?: Prisma.BoolFilter<"MessageThread"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"MessageThread"> | Date | string;
    listingId?: Prisma.StringFilter<"MessageThread"> | string;
    renterId?: Prisma.StringFilter<"MessageThread"> | string;
    listing?: Prisma.XOR<Prisma.ListingScalarRelationFilter, Prisma.ListingWhereInput>;
    renter?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    messages?: Prisma.MessageListRelationFilter;
}, "id">;
export type MessageThreadOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    unreadForRenter?: Prisma.SortOrder;
    unreadForOwner?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    renterId?: Prisma.SortOrder;
    _count?: Prisma.MessageThreadCountOrderByAggregateInput;
    _max?: Prisma.MessageThreadMaxOrderByAggregateInput;
    _min?: Prisma.MessageThreadMinOrderByAggregateInput;
};
export type MessageThreadScalarWhereWithAggregatesInput = {
    AND?: Prisma.MessageThreadScalarWhereWithAggregatesInput | Prisma.MessageThreadScalarWhereWithAggregatesInput[];
    OR?: Prisma.MessageThreadScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MessageThreadScalarWhereWithAggregatesInput | Prisma.MessageThreadScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"MessageThread"> | string;
    unreadForRenter?: Prisma.BoolWithAggregatesFilter<"MessageThread"> | boolean;
    unreadForOwner?: Prisma.BoolWithAggregatesFilter<"MessageThread"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"MessageThread"> | Date | string;
    listingId?: Prisma.StringWithAggregatesFilter<"MessageThread"> | string;
    renterId?: Prisma.StringWithAggregatesFilter<"MessageThread"> | string;
};
export type MessageThreadCreateInput = {
    id?: string;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: Date | string;
    listing: Prisma.ListingCreateNestedOneWithoutThreadsInput;
    renter: Prisma.UserCreateNestedOneWithoutMessageThreadsAsRenterInput;
    messages?: Prisma.MessageCreateNestedManyWithoutThreadInput;
};
export type MessageThreadUncheckedCreateInput = {
    id?: string;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: Date | string;
    listingId: string;
    renterId: string;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutThreadInput;
};
export type MessageThreadUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    unreadForRenter?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    unreadForOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    listing?: Prisma.ListingUpdateOneRequiredWithoutThreadsNestedInput;
    renter?: Prisma.UserUpdateOneRequiredWithoutMessageThreadsAsRenterNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutThreadNestedInput;
};
export type MessageThreadUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    unreadForRenter?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    unreadForOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    listingId?: Prisma.StringFieldUpdateOperationsInput | string;
    renterId?: Prisma.StringFieldUpdateOperationsInput | string;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutThreadNestedInput;
};
export type MessageThreadCreateManyInput = {
    id?: string;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: Date | string;
    listingId: string;
    renterId: string;
};
export type MessageThreadUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    unreadForRenter?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    unreadForOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MessageThreadUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    unreadForRenter?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    unreadForOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    listingId?: Prisma.StringFieldUpdateOperationsInput | string;
    renterId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MessageThreadListRelationFilter = {
    every?: Prisma.MessageThreadWhereInput;
    some?: Prisma.MessageThreadWhereInput;
    none?: Prisma.MessageThreadWhereInput;
};
export type MessageThreadOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MessageThreadCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    unreadForRenter?: Prisma.SortOrder;
    unreadForOwner?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    renterId?: Prisma.SortOrder;
};
export type MessageThreadMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    unreadForRenter?: Prisma.SortOrder;
    unreadForOwner?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    renterId?: Prisma.SortOrder;
};
export type MessageThreadMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    unreadForRenter?: Prisma.SortOrder;
    unreadForOwner?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    renterId?: Prisma.SortOrder;
};
export type MessageThreadScalarRelationFilter = {
    is?: Prisma.MessageThreadWhereInput;
    isNot?: Prisma.MessageThreadWhereInput;
};
export type MessageThreadCreateNestedManyWithoutRenterInput = {
    create?: Prisma.XOR<Prisma.MessageThreadCreateWithoutRenterInput, Prisma.MessageThreadUncheckedCreateWithoutRenterInput> | Prisma.MessageThreadCreateWithoutRenterInput[] | Prisma.MessageThreadUncheckedCreateWithoutRenterInput[];
    connectOrCreate?: Prisma.MessageThreadCreateOrConnectWithoutRenterInput | Prisma.MessageThreadCreateOrConnectWithoutRenterInput[];
    createMany?: Prisma.MessageThreadCreateManyRenterInputEnvelope;
    connect?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
};
export type MessageThreadUncheckedCreateNestedManyWithoutRenterInput = {
    create?: Prisma.XOR<Prisma.MessageThreadCreateWithoutRenterInput, Prisma.MessageThreadUncheckedCreateWithoutRenterInput> | Prisma.MessageThreadCreateWithoutRenterInput[] | Prisma.MessageThreadUncheckedCreateWithoutRenterInput[];
    connectOrCreate?: Prisma.MessageThreadCreateOrConnectWithoutRenterInput | Prisma.MessageThreadCreateOrConnectWithoutRenterInput[];
    createMany?: Prisma.MessageThreadCreateManyRenterInputEnvelope;
    connect?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
};
export type MessageThreadUpdateManyWithoutRenterNestedInput = {
    create?: Prisma.XOR<Prisma.MessageThreadCreateWithoutRenterInput, Prisma.MessageThreadUncheckedCreateWithoutRenterInput> | Prisma.MessageThreadCreateWithoutRenterInput[] | Prisma.MessageThreadUncheckedCreateWithoutRenterInput[];
    connectOrCreate?: Prisma.MessageThreadCreateOrConnectWithoutRenterInput | Prisma.MessageThreadCreateOrConnectWithoutRenterInput[];
    upsert?: Prisma.MessageThreadUpsertWithWhereUniqueWithoutRenterInput | Prisma.MessageThreadUpsertWithWhereUniqueWithoutRenterInput[];
    createMany?: Prisma.MessageThreadCreateManyRenterInputEnvelope;
    set?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    disconnect?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    delete?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    connect?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    update?: Prisma.MessageThreadUpdateWithWhereUniqueWithoutRenterInput | Prisma.MessageThreadUpdateWithWhereUniqueWithoutRenterInput[];
    updateMany?: Prisma.MessageThreadUpdateManyWithWhereWithoutRenterInput | Prisma.MessageThreadUpdateManyWithWhereWithoutRenterInput[];
    deleteMany?: Prisma.MessageThreadScalarWhereInput | Prisma.MessageThreadScalarWhereInput[];
};
export type MessageThreadUncheckedUpdateManyWithoutRenterNestedInput = {
    create?: Prisma.XOR<Prisma.MessageThreadCreateWithoutRenterInput, Prisma.MessageThreadUncheckedCreateWithoutRenterInput> | Prisma.MessageThreadCreateWithoutRenterInput[] | Prisma.MessageThreadUncheckedCreateWithoutRenterInput[];
    connectOrCreate?: Prisma.MessageThreadCreateOrConnectWithoutRenterInput | Prisma.MessageThreadCreateOrConnectWithoutRenterInput[];
    upsert?: Prisma.MessageThreadUpsertWithWhereUniqueWithoutRenterInput | Prisma.MessageThreadUpsertWithWhereUniqueWithoutRenterInput[];
    createMany?: Prisma.MessageThreadCreateManyRenterInputEnvelope;
    set?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    disconnect?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    delete?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    connect?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    update?: Prisma.MessageThreadUpdateWithWhereUniqueWithoutRenterInput | Prisma.MessageThreadUpdateWithWhereUniqueWithoutRenterInput[];
    updateMany?: Prisma.MessageThreadUpdateManyWithWhereWithoutRenterInput | Prisma.MessageThreadUpdateManyWithWhereWithoutRenterInput[];
    deleteMany?: Prisma.MessageThreadScalarWhereInput | Prisma.MessageThreadScalarWhereInput[];
};
export type MessageThreadCreateNestedManyWithoutListingInput = {
    create?: Prisma.XOR<Prisma.MessageThreadCreateWithoutListingInput, Prisma.MessageThreadUncheckedCreateWithoutListingInput> | Prisma.MessageThreadCreateWithoutListingInput[] | Prisma.MessageThreadUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.MessageThreadCreateOrConnectWithoutListingInput | Prisma.MessageThreadCreateOrConnectWithoutListingInput[];
    createMany?: Prisma.MessageThreadCreateManyListingInputEnvelope;
    connect?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
};
export type MessageThreadUncheckedCreateNestedManyWithoutListingInput = {
    create?: Prisma.XOR<Prisma.MessageThreadCreateWithoutListingInput, Prisma.MessageThreadUncheckedCreateWithoutListingInput> | Prisma.MessageThreadCreateWithoutListingInput[] | Prisma.MessageThreadUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.MessageThreadCreateOrConnectWithoutListingInput | Prisma.MessageThreadCreateOrConnectWithoutListingInput[];
    createMany?: Prisma.MessageThreadCreateManyListingInputEnvelope;
    connect?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
};
export type MessageThreadUpdateManyWithoutListingNestedInput = {
    create?: Prisma.XOR<Prisma.MessageThreadCreateWithoutListingInput, Prisma.MessageThreadUncheckedCreateWithoutListingInput> | Prisma.MessageThreadCreateWithoutListingInput[] | Prisma.MessageThreadUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.MessageThreadCreateOrConnectWithoutListingInput | Prisma.MessageThreadCreateOrConnectWithoutListingInput[];
    upsert?: Prisma.MessageThreadUpsertWithWhereUniqueWithoutListingInput | Prisma.MessageThreadUpsertWithWhereUniqueWithoutListingInput[];
    createMany?: Prisma.MessageThreadCreateManyListingInputEnvelope;
    set?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    disconnect?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    delete?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    connect?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    update?: Prisma.MessageThreadUpdateWithWhereUniqueWithoutListingInput | Prisma.MessageThreadUpdateWithWhereUniqueWithoutListingInput[];
    updateMany?: Prisma.MessageThreadUpdateManyWithWhereWithoutListingInput | Prisma.MessageThreadUpdateManyWithWhereWithoutListingInput[];
    deleteMany?: Prisma.MessageThreadScalarWhereInput | Prisma.MessageThreadScalarWhereInput[];
};
export type MessageThreadUncheckedUpdateManyWithoutListingNestedInput = {
    create?: Prisma.XOR<Prisma.MessageThreadCreateWithoutListingInput, Prisma.MessageThreadUncheckedCreateWithoutListingInput> | Prisma.MessageThreadCreateWithoutListingInput[] | Prisma.MessageThreadUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.MessageThreadCreateOrConnectWithoutListingInput | Prisma.MessageThreadCreateOrConnectWithoutListingInput[];
    upsert?: Prisma.MessageThreadUpsertWithWhereUniqueWithoutListingInput | Prisma.MessageThreadUpsertWithWhereUniqueWithoutListingInput[];
    createMany?: Prisma.MessageThreadCreateManyListingInputEnvelope;
    set?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    disconnect?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    delete?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    connect?: Prisma.MessageThreadWhereUniqueInput | Prisma.MessageThreadWhereUniqueInput[];
    update?: Prisma.MessageThreadUpdateWithWhereUniqueWithoutListingInput | Prisma.MessageThreadUpdateWithWhereUniqueWithoutListingInput[];
    updateMany?: Prisma.MessageThreadUpdateManyWithWhereWithoutListingInput | Prisma.MessageThreadUpdateManyWithWhereWithoutListingInput[];
    deleteMany?: Prisma.MessageThreadScalarWhereInput | Prisma.MessageThreadScalarWhereInput[];
};
export type MessageThreadCreateNestedOneWithoutMessagesInput = {
    create?: Prisma.XOR<Prisma.MessageThreadCreateWithoutMessagesInput, Prisma.MessageThreadUncheckedCreateWithoutMessagesInput>;
    connectOrCreate?: Prisma.MessageThreadCreateOrConnectWithoutMessagesInput;
    connect?: Prisma.MessageThreadWhereUniqueInput;
};
export type MessageThreadUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: Prisma.XOR<Prisma.MessageThreadCreateWithoutMessagesInput, Prisma.MessageThreadUncheckedCreateWithoutMessagesInput>;
    connectOrCreate?: Prisma.MessageThreadCreateOrConnectWithoutMessagesInput;
    upsert?: Prisma.MessageThreadUpsertWithoutMessagesInput;
    connect?: Prisma.MessageThreadWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MessageThreadUpdateToOneWithWhereWithoutMessagesInput, Prisma.MessageThreadUpdateWithoutMessagesInput>, Prisma.MessageThreadUncheckedUpdateWithoutMessagesInput>;
};
export type MessageThreadCreateWithoutRenterInput = {
    id?: string;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: Date | string;
    listing: Prisma.ListingCreateNestedOneWithoutThreadsInput;
    messages?: Prisma.MessageCreateNestedManyWithoutThreadInput;
};
export type MessageThreadUncheckedCreateWithoutRenterInput = {
    id?: string;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: Date | string;
    listingId: string;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutThreadInput;
};
export type MessageThreadCreateOrConnectWithoutRenterInput = {
    where: Prisma.MessageThreadWhereUniqueInput;
    create: Prisma.XOR<Prisma.MessageThreadCreateWithoutRenterInput, Prisma.MessageThreadUncheckedCreateWithoutRenterInput>;
};
export type MessageThreadCreateManyRenterInputEnvelope = {
    data: Prisma.MessageThreadCreateManyRenterInput | Prisma.MessageThreadCreateManyRenterInput[];
    skipDuplicates?: boolean;
};
export type MessageThreadUpsertWithWhereUniqueWithoutRenterInput = {
    where: Prisma.MessageThreadWhereUniqueInput;
    update: Prisma.XOR<Prisma.MessageThreadUpdateWithoutRenterInput, Prisma.MessageThreadUncheckedUpdateWithoutRenterInput>;
    create: Prisma.XOR<Prisma.MessageThreadCreateWithoutRenterInput, Prisma.MessageThreadUncheckedCreateWithoutRenterInput>;
};
export type MessageThreadUpdateWithWhereUniqueWithoutRenterInput = {
    where: Prisma.MessageThreadWhereUniqueInput;
    data: Prisma.XOR<Prisma.MessageThreadUpdateWithoutRenterInput, Prisma.MessageThreadUncheckedUpdateWithoutRenterInput>;
};
export type MessageThreadUpdateManyWithWhereWithoutRenterInput = {
    where: Prisma.MessageThreadScalarWhereInput;
    data: Prisma.XOR<Prisma.MessageThreadUpdateManyMutationInput, Prisma.MessageThreadUncheckedUpdateManyWithoutRenterInput>;
};
export type MessageThreadScalarWhereInput = {
    AND?: Prisma.MessageThreadScalarWhereInput | Prisma.MessageThreadScalarWhereInput[];
    OR?: Prisma.MessageThreadScalarWhereInput[];
    NOT?: Prisma.MessageThreadScalarWhereInput | Prisma.MessageThreadScalarWhereInput[];
    id?: Prisma.StringFilter<"MessageThread"> | string;
    unreadForRenter?: Prisma.BoolFilter<"MessageThread"> | boolean;
    unreadForOwner?: Prisma.BoolFilter<"MessageThread"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"MessageThread"> | Date | string;
    listingId?: Prisma.StringFilter<"MessageThread"> | string;
    renterId?: Prisma.StringFilter<"MessageThread"> | string;
};
export type MessageThreadCreateWithoutListingInput = {
    id?: string;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: Date | string;
    renter: Prisma.UserCreateNestedOneWithoutMessageThreadsAsRenterInput;
    messages?: Prisma.MessageCreateNestedManyWithoutThreadInput;
};
export type MessageThreadUncheckedCreateWithoutListingInput = {
    id?: string;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: Date | string;
    renterId: string;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutThreadInput;
};
export type MessageThreadCreateOrConnectWithoutListingInput = {
    where: Prisma.MessageThreadWhereUniqueInput;
    create: Prisma.XOR<Prisma.MessageThreadCreateWithoutListingInput, Prisma.MessageThreadUncheckedCreateWithoutListingInput>;
};
export type MessageThreadCreateManyListingInputEnvelope = {
    data: Prisma.MessageThreadCreateManyListingInput | Prisma.MessageThreadCreateManyListingInput[];
    skipDuplicates?: boolean;
};
export type MessageThreadUpsertWithWhereUniqueWithoutListingInput = {
    where: Prisma.MessageThreadWhereUniqueInput;
    update: Prisma.XOR<Prisma.MessageThreadUpdateWithoutListingInput, Prisma.MessageThreadUncheckedUpdateWithoutListingInput>;
    create: Prisma.XOR<Prisma.MessageThreadCreateWithoutListingInput, Prisma.MessageThreadUncheckedCreateWithoutListingInput>;
};
export type MessageThreadUpdateWithWhereUniqueWithoutListingInput = {
    where: Prisma.MessageThreadWhereUniqueInput;
    data: Prisma.XOR<Prisma.MessageThreadUpdateWithoutListingInput, Prisma.MessageThreadUncheckedUpdateWithoutListingInput>;
};
export type MessageThreadUpdateManyWithWhereWithoutListingInput = {
    where: Prisma.MessageThreadScalarWhereInput;
    data: Prisma.XOR<Prisma.MessageThreadUpdateManyMutationInput, Prisma.MessageThreadUncheckedUpdateManyWithoutListingInput>;
};
export type MessageThreadCreateWithoutMessagesInput = {
    id?: string;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: Date | string;
    listing: Prisma.ListingCreateNestedOneWithoutThreadsInput;
    renter: Prisma.UserCreateNestedOneWithoutMessageThreadsAsRenterInput;
};
export type MessageThreadUncheckedCreateWithoutMessagesInput = {
    id?: string;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: Date | string;
    listingId: string;
    renterId: string;
};
export type MessageThreadCreateOrConnectWithoutMessagesInput = {
    where: Prisma.MessageThreadWhereUniqueInput;
    create: Prisma.XOR<Prisma.MessageThreadCreateWithoutMessagesInput, Prisma.MessageThreadUncheckedCreateWithoutMessagesInput>;
};
export type MessageThreadUpsertWithoutMessagesInput = {
    update: Prisma.XOR<Prisma.MessageThreadUpdateWithoutMessagesInput, Prisma.MessageThreadUncheckedUpdateWithoutMessagesInput>;
    create: Prisma.XOR<Prisma.MessageThreadCreateWithoutMessagesInput, Prisma.MessageThreadUncheckedCreateWithoutMessagesInput>;
    where?: Prisma.MessageThreadWhereInput;
};
export type MessageThreadUpdateToOneWithWhereWithoutMessagesInput = {
    where?: Prisma.MessageThreadWhereInput;
    data: Prisma.XOR<Prisma.MessageThreadUpdateWithoutMessagesInput, Prisma.MessageThreadUncheckedUpdateWithoutMessagesInput>;
};
export type MessageThreadUpdateWithoutMessagesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    unreadForRenter?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    unreadForOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    listing?: Prisma.ListingUpdateOneRequiredWithoutThreadsNestedInput;
    renter?: Prisma.UserUpdateOneRequiredWithoutMessageThreadsAsRenterNestedInput;
};
export type MessageThreadUncheckedUpdateWithoutMessagesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    unreadForRenter?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    unreadForOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    listingId?: Prisma.StringFieldUpdateOperationsInput | string;
    renterId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MessageThreadCreateManyRenterInput = {
    id?: string;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: Date | string;
    listingId: string;
};
export type MessageThreadUpdateWithoutRenterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    unreadForRenter?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    unreadForOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    listing?: Prisma.ListingUpdateOneRequiredWithoutThreadsNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutThreadNestedInput;
};
export type MessageThreadUncheckedUpdateWithoutRenterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    unreadForRenter?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    unreadForOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    listingId?: Prisma.StringFieldUpdateOperationsInput | string;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutThreadNestedInput;
};
export type MessageThreadUncheckedUpdateManyWithoutRenterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    unreadForRenter?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    unreadForOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    listingId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MessageThreadCreateManyListingInput = {
    id?: string;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: Date | string;
    renterId: string;
};
export type MessageThreadUpdateWithoutListingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    unreadForRenter?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    unreadForOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    renter?: Prisma.UserUpdateOneRequiredWithoutMessageThreadsAsRenterNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutThreadNestedInput;
};
export type MessageThreadUncheckedUpdateWithoutListingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    unreadForRenter?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    unreadForOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    renterId?: Prisma.StringFieldUpdateOperationsInput | string;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutThreadNestedInput;
};
export type MessageThreadUncheckedUpdateManyWithoutListingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    unreadForRenter?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    unreadForOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    renterId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MessageThreadCountOutputType = {
    messages: number;
};
export type MessageThreadCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    messages?: boolean | MessageThreadCountOutputTypeCountMessagesArgs;
};
export type MessageThreadCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageThreadCountOutputTypeSelect<ExtArgs> | null;
};
export type MessageThreadCountOutputTypeCountMessagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageWhereInput;
};
export type MessageThreadSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: boolean;
    listingId?: boolean;
    renterId?: boolean;
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
    renter?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    messages?: boolean | Prisma.MessageThread$messagesArgs<ExtArgs>;
    _count?: boolean | Prisma.MessageThreadCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["messageThread"]>;
export type MessageThreadSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: boolean;
    listingId?: boolean;
    renterId?: boolean;
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
    renter?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["messageThread"]>;
export type MessageThreadSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: boolean;
    listingId?: boolean;
    renterId?: boolean;
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
    renter?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["messageThread"]>;
export type MessageThreadSelectScalar = {
    id?: boolean;
    unreadForRenter?: boolean;
    unreadForOwner?: boolean;
    createdAt?: boolean;
    listingId?: boolean;
    renterId?: boolean;
};
export type MessageThreadOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "unreadForRenter" | "unreadForOwner" | "createdAt" | "listingId" | "renterId", ExtArgs["result"]["messageThread"]>;
export type MessageThreadInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
    renter?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    messages?: boolean | Prisma.MessageThread$messagesArgs<ExtArgs>;
    _count?: boolean | Prisma.MessageThreadCountOutputTypeDefaultArgs<ExtArgs>;
};
export type MessageThreadIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
    renter?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type MessageThreadIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
    renter?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $MessageThreadPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MessageThread";
    objects: {
        listing: Prisma.$ListingPayload<ExtArgs>;
        renter: Prisma.$UserPayload<ExtArgs>;
        messages: Prisma.$MessagePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        unreadForRenter: boolean;
        unreadForOwner: boolean;
        createdAt: Date;
        listingId: string;
        renterId: string;
    }, ExtArgs["result"]["messageThread"]>;
    composites: {};
};
export type MessageThreadGetPayload<S extends boolean | null | undefined | MessageThreadDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload, S>;
export type MessageThreadCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MessageThreadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MessageThreadCountAggregateInputType | true;
};
export interface MessageThreadDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MessageThread'];
        meta: {
            name: 'MessageThread';
        };
    };
    findUnique<T extends MessageThreadFindUniqueArgs>(args: Prisma.SelectSubset<T, MessageThreadFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MessageThreadClient<runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MessageThreadFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MessageThreadFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MessageThreadClient<runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MessageThreadFindFirstArgs>(args?: Prisma.SelectSubset<T, MessageThreadFindFirstArgs<ExtArgs>>): Prisma.Prisma__MessageThreadClient<runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MessageThreadFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MessageThreadFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MessageThreadClient<runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MessageThreadFindManyArgs>(args?: Prisma.SelectSubset<T, MessageThreadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MessageThreadCreateArgs>(args: Prisma.SelectSubset<T, MessageThreadCreateArgs<ExtArgs>>): Prisma.Prisma__MessageThreadClient<runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MessageThreadCreateManyArgs>(args?: Prisma.SelectSubset<T, MessageThreadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MessageThreadCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MessageThreadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MessageThreadDeleteArgs>(args: Prisma.SelectSubset<T, MessageThreadDeleteArgs<ExtArgs>>): Prisma.Prisma__MessageThreadClient<runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MessageThreadUpdateArgs>(args: Prisma.SelectSubset<T, MessageThreadUpdateArgs<ExtArgs>>): Prisma.Prisma__MessageThreadClient<runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MessageThreadDeleteManyArgs>(args?: Prisma.SelectSubset<T, MessageThreadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MessageThreadUpdateManyArgs>(args: Prisma.SelectSubset<T, MessageThreadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MessageThreadUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MessageThreadUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MessageThreadUpsertArgs>(args: Prisma.SelectSubset<T, MessageThreadUpsertArgs<ExtArgs>>): Prisma.Prisma__MessageThreadClient<runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MessageThreadCountArgs>(args?: Prisma.Subset<T, MessageThreadCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MessageThreadCountAggregateOutputType> : number>;
    aggregate<T extends MessageThreadAggregateArgs>(args: Prisma.Subset<T, MessageThreadAggregateArgs>): Prisma.PrismaPromise<GetMessageThreadAggregateType<T>>;
    groupBy<T extends MessageThreadGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MessageThreadGroupByArgs['orderBy'];
    } : {
        orderBy?: MessageThreadGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MessageThreadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageThreadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MessageThreadFieldRefs;
}
export interface Prisma__MessageThreadClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    listing<T extends Prisma.ListingDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ListingDefaultArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    renter<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    messages<T extends Prisma.MessageThread$messagesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MessageThread$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MessageThreadFieldRefs {
    readonly id: Prisma.FieldRef<"MessageThread", 'String'>;
    readonly unreadForRenter: Prisma.FieldRef<"MessageThread", 'Boolean'>;
    readonly unreadForOwner: Prisma.FieldRef<"MessageThread", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"MessageThread", 'DateTime'>;
    readonly listingId: Prisma.FieldRef<"MessageThread", 'String'>;
    readonly renterId: Prisma.FieldRef<"MessageThread", 'String'>;
}
export type MessageThreadFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageThreadSelect<ExtArgs> | null;
    omit?: Prisma.MessageThreadOmit<ExtArgs> | null;
    include?: Prisma.MessageThreadInclude<ExtArgs> | null;
    where: Prisma.MessageThreadWhereUniqueInput;
};
export type MessageThreadFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageThreadSelect<ExtArgs> | null;
    omit?: Prisma.MessageThreadOmit<ExtArgs> | null;
    include?: Prisma.MessageThreadInclude<ExtArgs> | null;
    where: Prisma.MessageThreadWhereUniqueInput;
};
export type MessageThreadFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MessageThreadFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MessageThreadFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MessageThreadCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageThreadSelect<ExtArgs> | null;
    omit?: Prisma.MessageThreadOmit<ExtArgs> | null;
    include?: Prisma.MessageThreadInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MessageThreadCreateInput, Prisma.MessageThreadUncheckedCreateInput>;
};
export type MessageThreadCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MessageThreadCreateManyInput | Prisma.MessageThreadCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MessageThreadCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageThreadSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MessageThreadOmit<ExtArgs> | null;
    data: Prisma.MessageThreadCreateManyInput | Prisma.MessageThreadCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MessageThreadIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MessageThreadUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageThreadSelect<ExtArgs> | null;
    omit?: Prisma.MessageThreadOmit<ExtArgs> | null;
    include?: Prisma.MessageThreadInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MessageThreadUpdateInput, Prisma.MessageThreadUncheckedUpdateInput>;
    where: Prisma.MessageThreadWhereUniqueInput;
};
export type MessageThreadUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MessageThreadUpdateManyMutationInput, Prisma.MessageThreadUncheckedUpdateManyInput>;
    where?: Prisma.MessageThreadWhereInput;
    limit?: number;
};
export type MessageThreadUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageThreadSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MessageThreadOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MessageThreadUpdateManyMutationInput, Prisma.MessageThreadUncheckedUpdateManyInput>;
    where?: Prisma.MessageThreadWhereInput;
    limit?: number;
    include?: Prisma.MessageThreadIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MessageThreadUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageThreadSelect<ExtArgs> | null;
    omit?: Prisma.MessageThreadOmit<ExtArgs> | null;
    include?: Prisma.MessageThreadInclude<ExtArgs> | null;
    where: Prisma.MessageThreadWhereUniqueInput;
    create: Prisma.XOR<Prisma.MessageThreadCreateInput, Prisma.MessageThreadUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MessageThreadUpdateInput, Prisma.MessageThreadUncheckedUpdateInput>;
};
export type MessageThreadDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageThreadSelect<ExtArgs> | null;
    omit?: Prisma.MessageThreadOmit<ExtArgs> | null;
    include?: Prisma.MessageThreadInclude<ExtArgs> | null;
    where: Prisma.MessageThreadWhereUniqueInput;
};
export type MessageThreadDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageThreadWhereInput;
    limit?: number;
};
export type MessageThread$messagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageSelect<ExtArgs> | null;
    omit?: Prisma.MessageOmit<ExtArgs> | null;
    include?: Prisma.MessageInclude<ExtArgs> | null;
    where?: Prisma.MessageWhereInput;
    orderBy?: Prisma.MessageOrderByWithRelationInput | Prisma.MessageOrderByWithRelationInput[];
    cursor?: Prisma.MessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MessageScalarFieldEnum | Prisma.MessageScalarFieldEnum[];
};
export type MessageThreadDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageThreadSelect<ExtArgs> | null;
    omit?: Prisma.MessageThreadOmit<ExtArgs> | null;
    include?: Prisma.MessageThreadInclude<ExtArgs> | null;
};
