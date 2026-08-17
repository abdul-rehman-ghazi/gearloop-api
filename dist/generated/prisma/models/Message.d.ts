import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type MessageModel = runtime.Types.Result.DefaultSelection<Prisma.$MessagePayload>;
export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null;
    _min: MessageMinAggregateOutputType | null;
    _max: MessageMaxAggregateOutputType | null;
};
export type MessageMinAggregateOutputType = {
    id: string | null;
    text: string | null;
    sentAt: Date | null;
    threadId: string | null;
    senderId: string | null;
};
export type MessageMaxAggregateOutputType = {
    id: string | null;
    text: string | null;
    sentAt: Date | null;
    threadId: string | null;
    senderId: string | null;
};
export type MessageCountAggregateOutputType = {
    id: number;
    text: number;
    sentAt: number;
    threadId: number;
    senderId: number;
    _all: number;
};
export type MessageMinAggregateInputType = {
    id?: true;
    text?: true;
    sentAt?: true;
    threadId?: true;
    senderId?: true;
};
export type MessageMaxAggregateInputType = {
    id?: true;
    text?: true;
    sentAt?: true;
    threadId?: true;
    senderId?: true;
};
export type MessageCountAggregateInputType = {
    id?: true;
    text?: true;
    sentAt?: true;
    threadId?: true;
    senderId?: true;
    _all?: true;
};
export type MessageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageWhereInput;
    orderBy?: Prisma.MessageOrderByWithRelationInput | Prisma.MessageOrderByWithRelationInput[];
    cursor?: Prisma.MessageWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MessageCountAggregateInputType;
    _min?: MessageMinAggregateInputType;
    _max?: MessageMaxAggregateInputType;
};
export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
    [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMessage[P]> : Prisma.GetScalarType<T[P], AggregateMessage[P]>;
};
export type MessageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageWhereInput;
    orderBy?: Prisma.MessageOrderByWithAggregationInput | Prisma.MessageOrderByWithAggregationInput[];
    by: Prisma.MessageScalarFieldEnum[] | Prisma.MessageScalarFieldEnum;
    having?: Prisma.MessageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MessageCountAggregateInputType | true;
    _min?: MessageMinAggregateInputType;
    _max?: MessageMaxAggregateInputType;
};
export type MessageGroupByOutputType = {
    id: string;
    text: string;
    sentAt: Date;
    threadId: string;
    senderId: string;
    _count: MessageCountAggregateOutputType | null;
    _min: MessageMinAggregateOutputType | null;
    _max: MessageMaxAggregateOutputType | null;
};
export type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MessageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MessageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MessageGroupByOutputType[P]>;
}>>;
export type MessageWhereInput = {
    AND?: Prisma.MessageWhereInput | Prisma.MessageWhereInput[];
    OR?: Prisma.MessageWhereInput[];
    NOT?: Prisma.MessageWhereInput | Prisma.MessageWhereInput[];
    id?: Prisma.StringFilter<"Message"> | string;
    text?: Prisma.StringFilter<"Message"> | string;
    sentAt?: Prisma.DateTimeFilter<"Message"> | Date | string;
    threadId?: Prisma.StringFilter<"Message"> | string;
    senderId?: Prisma.StringFilter<"Message"> | string;
    thread?: Prisma.XOR<Prisma.MessageThreadScalarRelationFilter, Prisma.MessageThreadWhereInput>;
    sender?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type MessageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
    threadId?: Prisma.SortOrder;
    senderId?: Prisma.SortOrder;
    thread?: Prisma.MessageThreadOrderByWithRelationInput;
    sender?: Prisma.UserOrderByWithRelationInput;
};
export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.MessageWhereInput | Prisma.MessageWhereInput[];
    OR?: Prisma.MessageWhereInput[];
    NOT?: Prisma.MessageWhereInput | Prisma.MessageWhereInput[];
    text?: Prisma.StringFilter<"Message"> | string;
    sentAt?: Prisma.DateTimeFilter<"Message"> | Date | string;
    threadId?: Prisma.StringFilter<"Message"> | string;
    senderId?: Prisma.StringFilter<"Message"> | string;
    thread?: Prisma.XOR<Prisma.MessageThreadScalarRelationFilter, Prisma.MessageThreadWhereInput>;
    sender?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type MessageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
    threadId?: Prisma.SortOrder;
    senderId?: Prisma.SortOrder;
    _count?: Prisma.MessageCountOrderByAggregateInput;
    _max?: Prisma.MessageMaxOrderByAggregateInput;
    _min?: Prisma.MessageMinOrderByAggregateInput;
};
export type MessageScalarWhereWithAggregatesInput = {
    AND?: Prisma.MessageScalarWhereWithAggregatesInput | Prisma.MessageScalarWhereWithAggregatesInput[];
    OR?: Prisma.MessageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MessageScalarWhereWithAggregatesInput | Prisma.MessageScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Message"> | string;
    text?: Prisma.StringWithAggregatesFilter<"Message"> | string;
    sentAt?: Prisma.DateTimeWithAggregatesFilter<"Message"> | Date | string;
    threadId?: Prisma.StringWithAggregatesFilter<"Message"> | string;
    senderId?: Prisma.StringWithAggregatesFilter<"Message"> | string;
};
export type MessageCreateInput = {
    id?: string;
    text: string;
    sentAt?: Date | string;
    thread: Prisma.MessageThreadCreateNestedOneWithoutMessagesInput;
    sender: Prisma.UserCreateNestedOneWithoutMessagesInput;
};
export type MessageUncheckedCreateInput = {
    id?: string;
    text: string;
    sentAt?: Date | string;
    threadId: string;
    senderId: string;
};
export type MessageUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    thread?: Prisma.MessageThreadUpdateOneRequiredWithoutMessagesNestedInput;
    sender?: Prisma.UserUpdateOneRequiredWithoutMessagesNestedInput;
};
export type MessageUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    threadId?: Prisma.StringFieldUpdateOperationsInput | string;
    senderId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MessageCreateManyInput = {
    id?: string;
    text: string;
    sentAt?: Date | string;
    threadId: string;
    senderId: string;
};
export type MessageUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MessageUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    threadId?: Prisma.StringFieldUpdateOperationsInput | string;
    senderId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MessageListRelationFilter = {
    every?: Prisma.MessageWhereInput;
    some?: Prisma.MessageWhereInput;
    none?: Prisma.MessageWhereInput;
};
export type MessageOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MessageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
    threadId?: Prisma.SortOrder;
    senderId?: Prisma.SortOrder;
};
export type MessageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
    threadId?: Prisma.SortOrder;
    senderId?: Prisma.SortOrder;
};
export type MessageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
    threadId?: Prisma.SortOrder;
    senderId?: Prisma.SortOrder;
};
export type MessageCreateNestedManyWithoutSenderInput = {
    create?: Prisma.XOR<Prisma.MessageCreateWithoutSenderInput, Prisma.MessageUncheckedCreateWithoutSenderInput> | Prisma.MessageCreateWithoutSenderInput[] | Prisma.MessageUncheckedCreateWithoutSenderInput[];
    connectOrCreate?: Prisma.MessageCreateOrConnectWithoutSenderInput | Prisma.MessageCreateOrConnectWithoutSenderInput[];
    createMany?: Prisma.MessageCreateManySenderInputEnvelope;
    connect?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
};
export type MessageUncheckedCreateNestedManyWithoutSenderInput = {
    create?: Prisma.XOR<Prisma.MessageCreateWithoutSenderInput, Prisma.MessageUncheckedCreateWithoutSenderInput> | Prisma.MessageCreateWithoutSenderInput[] | Prisma.MessageUncheckedCreateWithoutSenderInput[];
    connectOrCreate?: Prisma.MessageCreateOrConnectWithoutSenderInput | Prisma.MessageCreateOrConnectWithoutSenderInput[];
    createMany?: Prisma.MessageCreateManySenderInputEnvelope;
    connect?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
};
export type MessageUpdateManyWithoutSenderNestedInput = {
    create?: Prisma.XOR<Prisma.MessageCreateWithoutSenderInput, Prisma.MessageUncheckedCreateWithoutSenderInput> | Prisma.MessageCreateWithoutSenderInput[] | Prisma.MessageUncheckedCreateWithoutSenderInput[];
    connectOrCreate?: Prisma.MessageCreateOrConnectWithoutSenderInput | Prisma.MessageCreateOrConnectWithoutSenderInput[];
    upsert?: Prisma.MessageUpsertWithWhereUniqueWithoutSenderInput | Prisma.MessageUpsertWithWhereUniqueWithoutSenderInput[];
    createMany?: Prisma.MessageCreateManySenderInputEnvelope;
    set?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    disconnect?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    delete?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    connect?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    update?: Prisma.MessageUpdateWithWhereUniqueWithoutSenderInput | Prisma.MessageUpdateWithWhereUniqueWithoutSenderInput[];
    updateMany?: Prisma.MessageUpdateManyWithWhereWithoutSenderInput | Prisma.MessageUpdateManyWithWhereWithoutSenderInput[];
    deleteMany?: Prisma.MessageScalarWhereInput | Prisma.MessageScalarWhereInput[];
};
export type MessageUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: Prisma.XOR<Prisma.MessageCreateWithoutSenderInput, Prisma.MessageUncheckedCreateWithoutSenderInput> | Prisma.MessageCreateWithoutSenderInput[] | Prisma.MessageUncheckedCreateWithoutSenderInput[];
    connectOrCreate?: Prisma.MessageCreateOrConnectWithoutSenderInput | Prisma.MessageCreateOrConnectWithoutSenderInput[];
    upsert?: Prisma.MessageUpsertWithWhereUniqueWithoutSenderInput | Prisma.MessageUpsertWithWhereUniqueWithoutSenderInput[];
    createMany?: Prisma.MessageCreateManySenderInputEnvelope;
    set?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    disconnect?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    delete?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    connect?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    update?: Prisma.MessageUpdateWithWhereUniqueWithoutSenderInput | Prisma.MessageUpdateWithWhereUniqueWithoutSenderInput[];
    updateMany?: Prisma.MessageUpdateManyWithWhereWithoutSenderInput | Prisma.MessageUpdateManyWithWhereWithoutSenderInput[];
    deleteMany?: Prisma.MessageScalarWhereInput | Prisma.MessageScalarWhereInput[];
};
export type MessageCreateNestedManyWithoutThreadInput = {
    create?: Prisma.XOR<Prisma.MessageCreateWithoutThreadInput, Prisma.MessageUncheckedCreateWithoutThreadInput> | Prisma.MessageCreateWithoutThreadInput[] | Prisma.MessageUncheckedCreateWithoutThreadInput[];
    connectOrCreate?: Prisma.MessageCreateOrConnectWithoutThreadInput | Prisma.MessageCreateOrConnectWithoutThreadInput[];
    createMany?: Prisma.MessageCreateManyThreadInputEnvelope;
    connect?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
};
export type MessageUncheckedCreateNestedManyWithoutThreadInput = {
    create?: Prisma.XOR<Prisma.MessageCreateWithoutThreadInput, Prisma.MessageUncheckedCreateWithoutThreadInput> | Prisma.MessageCreateWithoutThreadInput[] | Prisma.MessageUncheckedCreateWithoutThreadInput[];
    connectOrCreate?: Prisma.MessageCreateOrConnectWithoutThreadInput | Prisma.MessageCreateOrConnectWithoutThreadInput[];
    createMany?: Prisma.MessageCreateManyThreadInputEnvelope;
    connect?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
};
export type MessageUpdateManyWithoutThreadNestedInput = {
    create?: Prisma.XOR<Prisma.MessageCreateWithoutThreadInput, Prisma.MessageUncheckedCreateWithoutThreadInput> | Prisma.MessageCreateWithoutThreadInput[] | Prisma.MessageUncheckedCreateWithoutThreadInput[];
    connectOrCreate?: Prisma.MessageCreateOrConnectWithoutThreadInput | Prisma.MessageCreateOrConnectWithoutThreadInput[];
    upsert?: Prisma.MessageUpsertWithWhereUniqueWithoutThreadInput | Prisma.MessageUpsertWithWhereUniqueWithoutThreadInput[];
    createMany?: Prisma.MessageCreateManyThreadInputEnvelope;
    set?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    disconnect?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    delete?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    connect?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    update?: Prisma.MessageUpdateWithWhereUniqueWithoutThreadInput | Prisma.MessageUpdateWithWhereUniqueWithoutThreadInput[];
    updateMany?: Prisma.MessageUpdateManyWithWhereWithoutThreadInput | Prisma.MessageUpdateManyWithWhereWithoutThreadInput[];
    deleteMany?: Prisma.MessageScalarWhereInput | Prisma.MessageScalarWhereInput[];
};
export type MessageUncheckedUpdateManyWithoutThreadNestedInput = {
    create?: Prisma.XOR<Prisma.MessageCreateWithoutThreadInput, Prisma.MessageUncheckedCreateWithoutThreadInput> | Prisma.MessageCreateWithoutThreadInput[] | Prisma.MessageUncheckedCreateWithoutThreadInput[];
    connectOrCreate?: Prisma.MessageCreateOrConnectWithoutThreadInput | Prisma.MessageCreateOrConnectWithoutThreadInput[];
    upsert?: Prisma.MessageUpsertWithWhereUniqueWithoutThreadInput | Prisma.MessageUpsertWithWhereUniqueWithoutThreadInput[];
    createMany?: Prisma.MessageCreateManyThreadInputEnvelope;
    set?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    disconnect?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    delete?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    connect?: Prisma.MessageWhereUniqueInput | Prisma.MessageWhereUniqueInput[];
    update?: Prisma.MessageUpdateWithWhereUniqueWithoutThreadInput | Prisma.MessageUpdateWithWhereUniqueWithoutThreadInput[];
    updateMany?: Prisma.MessageUpdateManyWithWhereWithoutThreadInput | Prisma.MessageUpdateManyWithWhereWithoutThreadInput[];
    deleteMany?: Prisma.MessageScalarWhereInput | Prisma.MessageScalarWhereInput[];
};
export type MessageCreateWithoutSenderInput = {
    id?: string;
    text: string;
    sentAt?: Date | string;
    thread: Prisma.MessageThreadCreateNestedOneWithoutMessagesInput;
};
export type MessageUncheckedCreateWithoutSenderInput = {
    id?: string;
    text: string;
    sentAt?: Date | string;
    threadId: string;
};
export type MessageCreateOrConnectWithoutSenderInput = {
    where: Prisma.MessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.MessageCreateWithoutSenderInput, Prisma.MessageUncheckedCreateWithoutSenderInput>;
};
export type MessageCreateManySenderInputEnvelope = {
    data: Prisma.MessageCreateManySenderInput | Prisma.MessageCreateManySenderInput[];
    skipDuplicates?: boolean;
};
export type MessageUpsertWithWhereUniqueWithoutSenderInput = {
    where: Prisma.MessageWhereUniqueInput;
    update: Prisma.XOR<Prisma.MessageUpdateWithoutSenderInput, Prisma.MessageUncheckedUpdateWithoutSenderInput>;
    create: Prisma.XOR<Prisma.MessageCreateWithoutSenderInput, Prisma.MessageUncheckedCreateWithoutSenderInput>;
};
export type MessageUpdateWithWhereUniqueWithoutSenderInput = {
    where: Prisma.MessageWhereUniqueInput;
    data: Prisma.XOR<Prisma.MessageUpdateWithoutSenderInput, Prisma.MessageUncheckedUpdateWithoutSenderInput>;
};
export type MessageUpdateManyWithWhereWithoutSenderInput = {
    where: Prisma.MessageScalarWhereInput;
    data: Prisma.XOR<Prisma.MessageUpdateManyMutationInput, Prisma.MessageUncheckedUpdateManyWithoutSenderInput>;
};
export type MessageScalarWhereInput = {
    AND?: Prisma.MessageScalarWhereInput | Prisma.MessageScalarWhereInput[];
    OR?: Prisma.MessageScalarWhereInput[];
    NOT?: Prisma.MessageScalarWhereInput | Prisma.MessageScalarWhereInput[];
    id?: Prisma.StringFilter<"Message"> | string;
    text?: Prisma.StringFilter<"Message"> | string;
    sentAt?: Prisma.DateTimeFilter<"Message"> | Date | string;
    threadId?: Prisma.StringFilter<"Message"> | string;
    senderId?: Prisma.StringFilter<"Message"> | string;
};
export type MessageCreateWithoutThreadInput = {
    id?: string;
    text: string;
    sentAt?: Date | string;
    sender: Prisma.UserCreateNestedOneWithoutMessagesInput;
};
export type MessageUncheckedCreateWithoutThreadInput = {
    id?: string;
    text: string;
    sentAt?: Date | string;
    senderId: string;
};
export type MessageCreateOrConnectWithoutThreadInput = {
    where: Prisma.MessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.MessageCreateWithoutThreadInput, Prisma.MessageUncheckedCreateWithoutThreadInput>;
};
export type MessageCreateManyThreadInputEnvelope = {
    data: Prisma.MessageCreateManyThreadInput | Prisma.MessageCreateManyThreadInput[];
    skipDuplicates?: boolean;
};
export type MessageUpsertWithWhereUniqueWithoutThreadInput = {
    where: Prisma.MessageWhereUniqueInput;
    update: Prisma.XOR<Prisma.MessageUpdateWithoutThreadInput, Prisma.MessageUncheckedUpdateWithoutThreadInput>;
    create: Prisma.XOR<Prisma.MessageCreateWithoutThreadInput, Prisma.MessageUncheckedCreateWithoutThreadInput>;
};
export type MessageUpdateWithWhereUniqueWithoutThreadInput = {
    where: Prisma.MessageWhereUniqueInput;
    data: Prisma.XOR<Prisma.MessageUpdateWithoutThreadInput, Prisma.MessageUncheckedUpdateWithoutThreadInput>;
};
export type MessageUpdateManyWithWhereWithoutThreadInput = {
    where: Prisma.MessageScalarWhereInput;
    data: Prisma.XOR<Prisma.MessageUpdateManyMutationInput, Prisma.MessageUncheckedUpdateManyWithoutThreadInput>;
};
export type MessageCreateManySenderInput = {
    id?: string;
    text: string;
    sentAt?: Date | string;
    threadId: string;
};
export type MessageUpdateWithoutSenderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    thread?: Prisma.MessageThreadUpdateOneRequiredWithoutMessagesNestedInput;
};
export type MessageUncheckedUpdateWithoutSenderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    threadId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MessageUncheckedUpdateManyWithoutSenderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    threadId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MessageCreateManyThreadInput = {
    id?: string;
    text: string;
    sentAt?: Date | string;
    senderId: string;
};
export type MessageUpdateWithoutThreadInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sender?: Prisma.UserUpdateOneRequiredWithoutMessagesNestedInput;
};
export type MessageUncheckedUpdateWithoutThreadInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    senderId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MessageUncheckedUpdateManyWithoutThreadInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    senderId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MessageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    text?: boolean;
    sentAt?: boolean;
    threadId?: boolean;
    senderId?: boolean;
    thread?: boolean | Prisma.MessageThreadDefaultArgs<ExtArgs>;
    sender?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["message"]>;
export type MessageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    text?: boolean;
    sentAt?: boolean;
    threadId?: boolean;
    senderId?: boolean;
    thread?: boolean | Prisma.MessageThreadDefaultArgs<ExtArgs>;
    sender?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["message"]>;
export type MessageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    text?: boolean;
    sentAt?: boolean;
    threadId?: boolean;
    senderId?: boolean;
    thread?: boolean | Prisma.MessageThreadDefaultArgs<ExtArgs>;
    sender?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["message"]>;
export type MessageSelectScalar = {
    id?: boolean;
    text?: boolean;
    sentAt?: boolean;
    threadId?: boolean;
    senderId?: boolean;
};
export type MessageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "text" | "sentAt" | "threadId" | "senderId", ExtArgs["result"]["message"]>;
export type MessageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    thread?: boolean | Prisma.MessageThreadDefaultArgs<ExtArgs>;
    sender?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type MessageIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    thread?: boolean | Prisma.MessageThreadDefaultArgs<ExtArgs>;
    sender?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type MessageIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    thread?: boolean | Prisma.MessageThreadDefaultArgs<ExtArgs>;
    sender?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $MessagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Message";
    objects: {
        thread: Prisma.$MessageThreadPayload<ExtArgs>;
        sender: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        text: string;
        sentAt: Date;
        threadId: string;
        senderId: string;
    }, ExtArgs["result"]["message"]>;
    composites: {};
};
export type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MessagePayload, S>;
export type MessageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MessageCountAggregateInputType | true;
};
export interface MessageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Message'];
        meta: {
            name: 'Message';
        };
    };
    findUnique<T extends MessageFindUniqueArgs>(args: Prisma.SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MessageClient<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MessageClient<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MessageFindFirstArgs>(args?: Prisma.SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma.Prisma__MessageClient<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MessageClient<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MessageFindManyArgs>(args?: Prisma.SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MessageCreateArgs>(args: Prisma.SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma.Prisma__MessageClient<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MessageCreateManyArgs>(args?: Prisma.SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MessageDeleteArgs>(args: Prisma.SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma.Prisma__MessageClient<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MessageUpdateArgs>(args: Prisma.SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma.Prisma__MessageClient<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MessageDeleteManyArgs>(args?: Prisma.SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MessageUpdateManyArgs>(args: Prisma.SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MessageUpsertArgs>(args: Prisma.SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma.Prisma__MessageClient<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MessageCountArgs>(args?: Prisma.Subset<T, MessageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MessageCountAggregateOutputType> : number>;
    aggregate<T extends MessageAggregateArgs>(args: Prisma.Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>;
    groupBy<T extends MessageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MessageGroupByArgs['orderBy'];
    } : {
        orderBy?: MessageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MessageFieldRefs;
}
export interface Prisma__MessageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    thread<T extends Prisma.MessageThreadDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MessageThreadDefaultArgs<ExtArgs>>): Prisma.Prisma__MessageThreadClient<runtime.Types.Result.GetResult<Prisma.$MessageThreadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    sender<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MessageFieldRefs {
    readonly id: Prisma.FieldRef<"Message", 'String'>;
    readonly text: Prisma.FieldRef<"Message", 'String'>;
    readonly sentAt: Prisma.FieldRef<"Message", 'DateTime'>;
    readonly threadId: Prisma.FieldRef<"Message", 'String'>;
    readonly senderId: Prisma.FieldRef<"Message", 'String'>;
}
export type MessageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageSelect<ExtArgs> | null;
    omit?: Prisma.MessageOmit<ExtArgs> | null;
    include?: Prisma.MessageInclude<ExtArgs> | null;
    where: Prisma.MessageWhereUniqueInput;
};
export type MessageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageSelect<ExtArgs> | null;
    omit?: Prisma.MessageOmit<ExtArgs> | null;
    include?: Prisma.MessageInclude<ExtArgs> | null;
    where: Prisma.MessageWhereUniqueInput;
};
export type MessageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MessageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MessageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MessageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageSelect<ExtArgs> | null;
    omit?: Prisma.MessageOmit<ExtArgs> | null;
    include?: Prisma.MessageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MessageCreateInput, Prisma.MessageUncheckedCreateInput>;
};
export type MessageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MessageCreateManyInput | Prisma.MessageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MessageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MessageOmit<ExtArgs> | null;
    data: Prisma.MessageCreateManyInput | Prisma.MessageCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MessageIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MessageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageSelect<ExtArgs> | null;
    omit?: Prisma.MessageOmit<ExtArgs> | null;
    include?: Prisma.MessageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MessageUpdateInput, Prisma.MessageUncheckedUpdateInput>;
    where: Prisma.MessageWhereUniqueInput;
};
export type MessageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MessageUpdateManyMutationInput, Prisma.MessageUncheckedUpdateManyInput>;
    where?: Prisma.MessageWhereInput;
    limit?: number;
};
export type MessageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MessageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MessageUpdateManyMutationInput, Prisma.MessageUncheckedUpdateManyInput>;
    where?: Prisma.MessageWhereInput;
    limit?: number;
    include?: Prisma.MessageIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MessageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageSelect<ExtArgs> | null;
    omit?: Prisma.MessageOmit<ExtArgs> | null;
    include?: Prisma.MessageInclude<ExtArgs> | null;
    where: Prisma.MessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.MessageCreateInput, Prisma.MessageUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MessageUpdateInput, Prisma.MessageUncheckedUpdateInput>;
};
export type MessageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageSelect<ExtArgs> | null;
    omit?: Prisma.MessageOmit<ExtArgs> | null;
    include?: Prisma.MessageInclude<ExtArgs> | null;
    where: Prisma.MessageWhereUniqueInput;
};
export type MessageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageWhereInput;
    limit?: number;
};
export type MessageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageSelect<ExtArgs> | null;
    omit?: Prisma.MessageOmit<ExtArgs> | null;
    include?: Prisma.MessageInclude<ExtArgs> | null;
};
