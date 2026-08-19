import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    passwordHash: string | null;
    initials: string | null;
    isOwner: boolean | null;
    isSuspended: boolean | null;
    memberSince: Date | null;
    responseTime: string | null;
    deletedAt: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    passwordHash: string | null;
    initials: string | null;
    isOwner: boolean | null;
    isSuspended: boolean | null;
    memberSince: Date | null;
    responseTime: string | null;
    deletedAt: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    name: number;
    email: number;
    passwordHash: number;
    initials: number;
    isOwner: number;
    isSuspended: number;
    memberSince: number;
    responseTime: number;
    deletedAt: number;
    _all: number;
};
export type UserMinAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    passwordHash?: true;
    initials?: true;
    isOwner?: true;
    isSuspended?: true;
    memberSince?: true;
    responseTime?: true;
    deletedAt?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    passwordHash?: true;
    initials?: true;
    isOwner?: true;
    isSuspended?: true;
    memberSince?: true;
    responseTime?: true;
    deletedAt?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    passwordHash?: true;
    initials?: true;
    isOwner?: true;
    isSuspended?: true;
    memberSince?: true;
    responseTime?: true;
    deletedAt?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCountAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    initials: string;
    isOwner: boolean;
    isSuspended: boolean;
    memberSince: Date;
    responseTime: string | null;
    deletedAt: Date | null;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.StringFilter<"User"> | string;
    name?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    initials?: Prisma.StringFilter<"User"> | string;
    isOwner?: Prisma.BoolFilter<"User"> | boolean;
    isSuspended?: Prisma.BoolFilter<"User"> | boolean;
    memberSince?: Prisma.DateTimeFilter<"User"> | Date | string;
    responseTime?: Prisma.StringNullableFilter<"User"> | string | null;
    deletedAt?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    listings?: Prisma.ListingListRelationFilter;
    bookings?: Prisma.BookingListRelationFilter;
    paymentMethods?: Prisma.PaymentMethodListRelationFilter;
    messages?: Prisma.MessageListRelationFilter;
    messageThreadsAsRenter?: Prisma.MessageThreadListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    initials?: Prisma.SortOrder;
    isOwner?: Prisma.SortOrder;
    isSuspended?: Prisma.SortOrder;
    memberSince?: Prisma.SortOrder;
    responseTime?: Prisma.SortOrderInput | Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    listings?: Prisma.ListingOrderByRelationAggregateInput;
    bookings?: Prisma.BookingOrderByRelationAggregateInput;
    paymentMethods?: Prisma.PaymentMethodOrderByRelationAggregateInput;
    messages?: Prisma.MessageOrderByRelationAggregateInput;
    messageThreadsAsRenter?: Prisma.MessageThreadOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    name?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    initials?: Prisma.StringFilter<"User"> | string;
    isOwner?: Prisma.BoolFilter<"User"> | boolean;
    isSuspended?: Prisma.BoolFilter<"User"> | boolean;
    memberSince?: Prisma.DateTimeFilter<"User"> | Date | string;
    responseTime?: Prisma.StringNullableFilter<"User"> | string | null;
    deletedAt?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    listings?: Prisma.ListingListRelationFilter;
    bookings?: Prisma.BookingListRelationFilter;
    paymentMethods?: Prisma.PaymentMethodListRelationFilter;
    messages?: Prisma.MessageListRelationFilter;
    messageThreadsAsRenter?: Prisma.MessageThreadListRelationFilter;
}, "id" | "email">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    initials?: Prisma.SortOrder;
    isOwner?: Prisma.SortOrder;
    isSuspended?: Prisma.SortOrder;
    memberSince?: Prisma.SortOrder;
    responseTime?: Prisma.SortOrderInput | Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"User"> | string;
    name?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    passwordHash?: Prisma.StringWithAggregatesFilter<"User"> | string;
    initials?: Prisma.StringWithAggregatesFilter<"User"> | string;
    isOwner?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    isSuspended?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    memberSince?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    responseTime?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null;
};
export type UserCreateInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    initials: string;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: Date | string;
    responseTime?: string | null;
    deletedAt?: Date | string | null;
    listings?: Prisma.ListingCreateNestedManyWithoutOwnerInput;
    bookings?: Prisma.BookingCreateNestedManyWithoutRenterInput;
    paymentMethods?: Prisma.PaymentMethodCreateNestedManyWithoutUserInput;
    messages?: Prisma.MessageCreateNestedManyWithoutSenderInput;
    messageThreadsAsRenter?: Prisma.MessageThreadCreateNestedManyWithoutRenterInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    initials: string;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: Date | string;
    responseTime?: string | null;
    deletedAt?: Date | string | null;
    listings?: Prisma.ListingUncheckedCreateNestedManyWithoutOwnerInput;
    bookings?: Prisma.BookingUncheckedCreateNestedManyWithoutRenterInput;
    paymentMethods?: Prisma.PaymentMethodUncheckedCreateNestedManyWithoutUserInput;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutSenderInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUncheckedCreateNestedManyWithoutRenterInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    initials?: Prisma.StringFieldUpdateOperationsInput | string;
    isOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSuspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberSince?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    responseTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    listings?: Prisma.ListingUpdateManyWithoutOwnerNestedInput;
    bookings?: Prisma.BookingUpdateManyWithoutRenterNestedInput;
    paymentMethods?: Prisma.PaymentMethodUpdateManyWithoutUserNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutSenderNestedInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUpdateManyWithoutRenterNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    initials?: Prisma.StringFieldUpdateOperationsInput | string;
    isOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSuspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberSince?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    responseTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    listings?: Prisma.ListingUncheckedUpdateManyWithoutOwnerNestedInput;
    bookings?: Prisma.BookingUncheckedUpdateManyWithoutRenterNestedInput;
    paymentMethods?: Prisma.PaymentMethodUncheckedUpdateManyWithoutUserNestedInput;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutSenderNestedInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUncheckedUpdateManyWithoutRenterNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    initials: string;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: Date | string;
    responseTime?: string | null;
    deletedAt?: Date | string | null;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    initials?: Prisma.StringFieldUpdateOperationsInput | string;
    isOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSuspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberSince?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    responseTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    initials?: Prisma.StringFieldUpdateOperationsInput | string;
    isOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSuspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberSince?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    responseTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    initials?: Prisma.SortOrder;
    isOwner?: Prisma.SortOrder;
    isSuspended?: Prisma.SortOrder;
    memberSince?: Prisma.SortOrder;
    responseTime?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    initials?: Prisma.SortOrder;
    isOwner?: Prisma.SortOrder;
    isSuspended?: Prisma.SortOrder;
    memberSince?: Prisma.SortOrder;
    responseTime?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    initials?: Prisma.SortOrder;
    isOwner?: Prisma.SortOrder;
    isSuspended?: Prisma.SortOrder;
    memberSince?: Prisma.SortOrder;
    responseTime?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type UserCreateNestedOneWithoutListingsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutListingsInput, Prisma.UserUncheckedCreateWithoutListingsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutListingsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutListingsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutListingsInput, Prisma.UserUncheckedCreateWithoutListingsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutListingsInput;
    upsert?: Prisma.UserUpsertWithoutListingsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutListingsInput, Prisma.UserUpdateWithoutListingsInput>, Prisma.UserUncheckedUpdateWithoutListingsInput>;
};
export type UserCreateNestedOneWithoutBookingsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutBookingsInput, Prisma.UserUncheckedCreateWithoutBookingsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutBookingsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutBookingsInput, Prisma.UserUncheckedCreateWithoutBookingsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutBookingsInput;
    upsert?: Prisma.UserUpsertWithoutBookingsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutBookingsInput, Prisma.UserUpdateWithoutBookingsInput>, Prisma.UserUncheckedUpdateWithoutBookingsInput>;
};
export type UserCreateNestedOneWithoutPaymentMethodsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPaymentMethodsInput, Prisma.UserUncheckedCreateWithoutPaymentMethodsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPaymentMethodsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutPaymentMethodsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPaymentMethodsInput, Prisma.UserUncheckedCreateWithoutPaymentMethodsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPaymentMethodsInput;
    upsert?: Prisma.UserUpsertWithoutPaymentMethodsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutPaymentMethodsInput, Prisma.UserUpdateWithoutPaymentMethodsInput>, Prisma.UserUncheckedUpdateWithoutPaymentMethodsInput>;
};
export type UserCreateNestedOneWithoutMessageThreadsAsRenterInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutMessageThreadsAsRenterInput, Prisma.UserUncheckedCreateWithoutMessageThreadsAsRenterInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutMessageThreadsAsRenterInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutMessageThreadsAsRenterNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutMessageThreadsAsRenterInput, Prisma.UserUncheckedCreateWithoutMessageThreadsAsRenterInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutMessageThreadsAsRenterInput;
    upsert?: Prisma.UserUpsertWithoutMessageThreadsAsRenterInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutMessageThreadsAsRenterInput, Prisma.UserUpdateWithoutMessageThreadsAsRenterInput>, Prisma.UserUncheckedUpdateWithoutMessageThreadsAsRenterInput>;
};
export type UserCreateNestedOneWithoutMessagesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutMessagesInput, Prisma.UserUncheckedCreateWithoutMessagesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutMessagesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutMessagesInput, Prisma.UserUncheckedCreateWithoutMessagesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutMessagesInput;
    upsert?: Prisma.UserUpsertWithoutMessagesInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutMessagesInput, Prisma.UserUpdateWithoutMessagesInput>, Prisma.UserUncheckedUpdateWithoutMessagesInput>;
};
export type UserCreateWithoutListingsInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    initials: string;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: Date | string;
    responseTime?: string | null;
    deletedAt?: Date | string | null;
    bookings?: Prisma.BookingCreateNestedManyWithoutRenterInput;
    paymentMethods?: Prisma.PaymentMethodCreateNestedManyWithoutUserInput;
    messages?: Prisma.MessageCreateNestedManyWithoutSenderInput;
    messageThreadsAsRenter?: Prisma.MessageThreadCreateNestedManyWithoutRenterInput;
};
export type UserUncheckedCreateWithoutListingsInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    initials: string;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: Date | string;
    responseTime?: string | null;
    deletedAt?: Date | string | null;
    bookings?: Prisma.BookingUncheckedCreateNestedManyWithoutRenterInput;
    paymentMethods?: Prisma.PaymentMethodUncheckedCreateNestedManyWithoutUserInput;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutSenderInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUncheckedCreateNestedManyWithoutRenterInput;
};
export type UserCreateOrConnectWithoutListingsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutListingsInput, Prisma.UserUncheckedCreateWithoutListingsInput>;
};
export type UserUpsertWithoutListingsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutListingsInput, Prisma.UserUncheckedUpdateWithoutListingsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutListingsInput, Prisma.UserUncheckedCreateWithoutListingsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutListingsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutListingsInput, Prisma.UserUncheckedUpdateWithoutListingsInput>;
};
export type UserUpdateWithoutListingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    initials?: Prisma.StringFieldUpdateOperationsInput | string;
    isOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSuspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberSince?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    responseTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bookings?: Prisma.BookingUpdateManyWithoutRenterNestedInput;
    paymentMethods?: Prisma.PaymentMethodUpdateManyWithoutUserNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutSenderNestedInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUpdateManyWithoutRenterNestedInput;
};
export type UserUncheckedUpdateWithoutListingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    initials?: Prisma.StringFieldUpdateOperationsInput | string;
    isOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSuspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberSince?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    responseTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bookings?: Prisma.BookingUncheckedUpdateManyWithoutRenterNestedInput;
    paymentMethods?: Prisma.PaymentMethodUncheckedUpdateManyWithoutUserNestedInput;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutSenderNestedInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUncheckedUpdateManyWithoutRenterNestedInput;
};
export type UserCreateWithoutBookingsInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    initials: string;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: Date | string;
    responseTime?: string | null;
    deletedAt?: Date | string | null;
    listings?: Prisma.ListingCreateNestedManyWithoutOwnerInput;
    paymentMethods?: Prisma.PaymentMethodCreateNestedManyWithoutUserInput;
    messages?: Prisma.MessageCreateNestedManyWithoutSenderInput;
    messageThreadsAsRenter?: Prisma.MessageThreadCreateNestedManyWithoutRenterInput;
};
export type UserUncheckedCreateWithoutBookingsInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    initials: string;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: Date | string;
    responseTime?: string | null;
    deletedAt?: Date | string | null;
    listings?: Prisma.ListingUncheckedCreateNestedManyWithoutOwnerInput;
    paymentMethods?: Prisma.PaymentMethodUncheckedCreateNestedManyWithoutUserInput;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutSenderInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUncheckedCreateNestedManyWithoutRenterInput;
};
export type UserCreateOrConnectWithoutBookingsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutBookingsInput, Prisma.UserUncheckedCreateWithoutBookingsInput>;
};
export type UserUpsertWithoutBookingsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutBookingsInput, Prisma.UserUncheckedUpdateWithoutBookingsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutBookingsInput, Prisma.UserUncheckedCreateWithoutBookingsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutBookingsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutBookingsInput, Prisma.UserUncheckedUpdateWithoutBookingsInput>;
};
export type UserUpdateWithoutBookingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    initials?: Prisma.StringFieldUpdateOperationsInput | string;
    isOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSuspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberSince?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    responseTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    listings?: Prisma.ListingUpdateManyWithoutOwnerNestedInput;
    paymentMethods?: Prisma.PaymentMethodUpdateManyWithoutUserNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutSenderNestedInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUpdateManyWithoutRenterNestedInput;
};
export type UserUncheckedUpdateWithoutBookingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    initials?: Prisma.StringFieldUpdateOperationsInput | string;
    isOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSuspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberSince?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    responseTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    listings?: Prisma.ListingUncheckedUpdateManyWithoutOwnerNestedInput;
    paymentMethods?: Prisma.PaymentMethodUncheckedUpdateManyWithoutUserNestedInput;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutSenderNestedInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUncheckedUpdateManyWithoutRenterNestedInput;
};
export type UserCreateWithoutPaymentMethodsInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    initials: string;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: Date | string;
    responseTime?: string | null;
    deletedAt?: Date | string | null;
    listings?: Prisma.ListingCreateNestedManyWithoutOwnerInput;
    bookings?: Prisma.BookingCreateNestedManyWithoutRenterInput;
    messages?: Prisma.MessageCreateNestedManyWithoutSenderInput;
    messageThreadsAsRenter?: Prisma.MessageThreadCreateNestedManyWithoutRenterInput;
};
export type UserUncheckedCreateWithoutPaymentMethodsInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    initials: string;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: Date | string;
    responseTime?: string | null;
    deletedAt?: Date | string | null;
    listings?: Prisma.ListingUncheckedCreateNestedManyWithoutOwnerInput;
    bookings?: Prisma.BookingUncheckedCreateNestedManyWithoutRenterInput;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutSenderInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUncheckedCreateNestedManyWithoutRenterInput;
};
export type UserCreateOrConnectWithoutPaymentMethodsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutPaymentMethodsInput, Prisma.UserUncheckedCreateWithoutPaymentMethodsInput>;
};
export type UserUpsertWithoutPaymentMethodsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutPaymentMethodsInput, Prisma.UserUncheckedUpdateWithoutPaymentMethodsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutPaymentMethodsInput, Prisma.UserUncheckedCreateWithoutPaymentMethodsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutPaymentMethodsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutPaymentMethodsInput, Prisma.UserUncheckedUpdateWithoutPaymentMethodsInput>;
};
export type UserUpdateWithoutPaymentMethodsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    initials?: Prisma.StringFieldUpdateOperationsInput | string;
    isOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSuspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberSince?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    responseTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    listings?: Prisma.ListingUpdateManyWithoutOwnerNestedInput;
    bookings?: Prisma.BookingUpdateManyWithoutRenterNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutSenderNestedInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUpdateManyWithoutRenterNestedInput;
};
export type UserUncheckedUpdateWithoutPaymentMethodsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    initials?: Prisma.StringFieldUpdateOperationsInput | string;
    isOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSuspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberSince?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    responseTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    listings?: Prisma.ListingUncheckedUpdateManyWithoutOwnerNestedInput;
    bookings?: Prisma.BookingUncheckedUpdateManyWithoutRenterNestedInput;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutSenderNestedInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUncheckedUpdateManyWithoutRenterNestedInput;
};
export type UserCreateWithoutMessageThreadsAsRenterInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    initials: string;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: Date | string;
    responseTime?: string | null;
    deletedAt?: Date | string | null;
    listings?: Prisma.ListingCreateNestedManyWithoutOwnerInput;
    bookings?: Prisma.BookingCreateNestedManyWithoutRenterInput;
    paymentMethods?: Prisma.PaymentMethodCreateNestedManyWithoutUserInput;
    messages?: Prisma.MessageCreateNestedManyWithoutSenderInput;
};
export type UserUncheckedCreateWithoutMessageThreadsAsRenterInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    initials: string;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: Date | string;
    responseTime?: string | null;
    deletedAt?: Date | string | null;
    listings?: Prisma.ListingUncheckedCreateNestedManyWithoutOwnerInput;
    bookings?: Prisma.BookingUncheckedCreateNestedManyWithoutRenterInput;
    paymentMethods?: Prisma.PaymentMethodUncheckedCreateNestedManyWithoutUserInput;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutSenderInput;
};
export type UserCreateOrConnectWithoutMessageThreadsAsRenterInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutMessageThreadsAsRenterInput, Prisma.UserUncheckedCreateWithoutMessageThreadsAsRenterInput>;
};
export type UserUpsertWithoutMessageThreadsAsRenterInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutMessageThreadsAsRenterInput, Prisma.UserUncheckedUpdateWithoutMessageThreadsAsRenterInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutMessageThreadsAsRenterInput, Prisma.UserUncheckedCreateWithoutMessageThreadsAsRenterInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutMessageThreadsAsRenterInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutMessageThreadsAsRenterInput, Prisma.UserUncheckedUpdateWithoutMessageThreadsAsRenterInput>;
};
export type UserUpdateWithoutMessageThreadsAsRenterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    initials?: Prisma.StringFieldUpdateOperationsInput | string;
    isOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSuspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberSince?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    responseTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    listings?: Prisma.ListingUpdateManyWithoutOwnerNestedInput;
    bookings?: Prisma.BookingUpdateManyWithoutRenterNestedInput;
    paymentMethods?: Prisma.PaymentMethodUpdateManyWithoutUserNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutSenderNestedInput;
};
export type UserUncheckedUpdateWithoutMessageThreadsAsRenterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    initials?: Prisma.StringFieldUpdateOperationsInput | string;
    isOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSuspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberSince?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    responseTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    listings?: Prisma.ListingUncheckedUpdateManyWithoutOwnerNestedInput;
    bookings?: Prisma.BookingUncheckedUpdateManyWithoutRenterNestedInput;
    paymentMethods?: Prisma.PaymentMethodUncheckedUpdateManyWithoutUserNestedInput;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutSenderNestedInput;
};
export type UserCreateWithoutMessagesInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    initials: string;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: Date | string;
    responseTime?: string | null;
    deletedAt?: Date | string | null;
    listings?: Prisma.ListingCreateNestedManyWithoutOwnerInput;
    bookings?: Prisma.BookingCreateNestedManyWithoutRenterInput;
    paymentMethods?: Prisma.PaymentMethodCreateNestedManyWithoutUserInput;
    messageThreadsAsRenter?: Prisma.MessageThreadCreateNestedManyWithoutRenterInput;
};
export type UserUncheckedCreateWithoutMessagesInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    initials: string;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: Date | string;
    responseTime?: string | null;
    deletedAt?: Date | string | null;
    listings?: Prisma.ListingUncheckedCreateNestedManyWithoutOwnerInput;
    bookings?: Prisma.BookingUncheckedCreateNestedManyWithoutRenterInput;
    paymentMethods?: Prisma.PaymentMethodUncheckedCreateNestedManyWithoutUserInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUncheckedCreateNestedManyWithoutRenterInput;
};
export type UserCreateOrConnectWithoutMessagesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutMessagesInput, Prisma.UserUncheckedCreateWithoutMessagesInput>;
};
export type UserUpsertWithoutMessagesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutMessagesInput, Prisma.UserUncheckedUpdateWithoutMessagesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutMessagesInput, Prisma.UserUncheckedCreateWithoutMessagesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutMessagesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutMessagesInput, Prisma.UserUncheckedUpdateWithoutMessagesInput>;
};
export type UserUpdateWithoutMessagesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    initials?: Prisma.StringFieldUpdateOperationsInput | string;
    isOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSuspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberSince?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    responseTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    listings?: Prisma.ListingUpdateManyWithoutOwnerNestedInput;
    bookings?: Prisma.BookingUpdateManyWithoutRenterNestedInput;
    paymentMethods?: Prisma.PaymentMethodUpdateManyWithoutUserNestedInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUpdateManyWithoutRenterNestedInput;
};
export type UserUncheckedUpdateWithoutMessagesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    initials?: Prisma.StringFieldUpdateOperationsInput | string;
    isOwner?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSuspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberSince?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    responseTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    listings?: Prisma.ListingUncheckedUpdateManyWithoutOwnerNestedInput;
    bookings?: Prisma.BookingUncheckedUpdateManyWithoutRenterNestedInput;
    paymentMethods?: Prisma.PaymentMethodUncheckedUpdateManyWithoutUserNestedInput;
    messageThreadsAsRenter?: Prisma.MessageThreadUncheckedUpdateManyWithoutRenterNestedInput;
};
export type UserCountOutputType = {
    listings: number;
    bookings: number;
    paymentMethods: number;
    messages: number;
    messageThreadsAsRenter: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    listings?: boolean | UserCountOutputTypeCountListingsArgs;
    bookings?: boolean | UserCountOutputTypeCountBookingsArgs;
    paymentMethods?: boolean | UserCountOutputTypeCountPaymentMethodsArgs;
    messages?: boolean | UserCountOutputTypeCountMessagesArgs;
    messageThreadsAsRenter?: boolean | UserCountOutputTypeCountMessageThreadsAsRenterArgs;
};
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
export type UserCountOutputTypeCountListingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListingWhereInput;
};
export type UserCountOutputTypeCountBookingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BookingWhereInput;
};
export type UserCountOutputTypeCountPaymentMethodsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentMethodWhereInput;
};
export type UserCountOutputTypeCountMessagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageWhereInput;
};
export type UserCountOutputTypeCountMessageThreadsAsRenterArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageThreadWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    initials?: boolean;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: boolean;
    responseTime?: boolean;
    deletedAt?: boolean;
    listings?: boolean | Prisma.User$listingsArgs<ExtArgs>;
    bookings?: boolean | Prisma.User$bookingsArgs<ExtArgs>;
    paymentMethods?: boolean | Prisma.User$paymentMethodsArgs<ExtArgs>;
    messages?: boolean | Prisma.User$messagesArgs<ExtArgs>;
    messageThreadsAsRenter?: boolean | Prisma.User$messageThreadsAsRenterArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    initials?: boolean;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: boolean;
    responseTime?: boolean;
    deletedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    initials?: boolean;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: boolean;
    responseTime?: boolean;
    deletedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    name?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    initials?: boolean;
    isOwner?: boolean;
    isSuspended?: boolean;
    memberSince?: boolean;
    responseTime?: boolean;
    deletedAt?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "email" | "passwordHash" | "initials" | "isOwner" | "isSuspended" | "memberSince" | "responseTime" | "deletedAt", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    listings?: boolean | Prisma.User$listingsArgs<ExtArgs>;
    bookings?: boolean | Prisma.User$bookingsArgs<ExtArgs>;
    paymentMethods?: boolean | Prisma.User$paymentMethodsArgs<ExtArgs>;
    messages?: boolean | Prisma.User$messagesArgs<ExtArgs>;
    messageThreadsAsRenter?: boolean | Prisma.User$messageThreadsAsRenterArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        listings: Prisma.$ListingPayload<ExtArgs>[];
        bookings: Prisma.$BookingPayload<ExtArgs>[];
        paymentMethods: Prisma.$PaymentMethodPayload<ExtArgs>[];
        messages: Prisma.$MessagePayload<ExtArgs>[];
        messageThreadsAsRenter: Prisma.$MessageThreadPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        email: string;
        passwordHash: string;
        initials: string;
        isOwner: boolean;
        isSuspended: boolean;
        memberSince: Date;
        responseTime: string | null;
        deletedAt: Date | null;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFieldRefs;
}
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    listings<T extends Prisma.User$listingsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$listingsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    bookings<T extends Prisma.User$bookingsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    paymentMethods<T extends Prisma.User$paymentMethodsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$paymentMethodsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentMethodPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    messages<T extends Prisma.User$messagesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    messageThreadsAsRenter<T extends Prisma.User$messageThreadsAsRenterArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$messageThreadsAsRenterArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly name: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly passwordHash: Prisma.FieldRef<"User", 'String'>;
    readonly initials: Prisma.FieldRef<"User", 'String'>;
    readonly isOwner: Prisma.FieldRef<"User", 'Boolean'>;
    readonly isSuspended: Prisma.FieldRef<"User", 'Boolean'>;
    readonly memberSince: Prisma.FieldRef<"User", 'DateTime'>;
    readonly responseTime: Prisma.FieldRef<"User", 'String'>;
    readonly deletedAt: Prisma.FieldRef<"User", 'DateTime'>;
}
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    where: Prisma.UserWhereUniqueInput;
};
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type User$listingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$bookingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$paymentMethodsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$messagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$messageThreadsAsRenterArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};
