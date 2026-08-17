import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type DisputeModel = runtime.Types.Result.DefaultSelection<Prisma.$DisputePayload>;
export type AggregateDispute = {
    _count: DisputeCountAggregateOutputType | null;
    _min: DisputeMinAggregateOutputType | null;
    _max: DisputeMaxAggregateOutputType | null;
};
export type DisputeMinAggregateOutputType = {
    id: string | null;
    status: $Enums.DisputeStatus | null;
    detail: string | null;
    bookingId: string | null;
};
export type DisputeMaxAggregateOutputType = {
    id: string | null;
    status: $Enums.DisputeStatus | null;
    detail: string | null;
    bookingId: string | null;
};
export type DisputeCountAggregateOutputType = {
    id: number;
    status: number;
    detail: number;
    bookingId: number;
    _all: number;
};
export type DisputeMinAggregateInputType = {
    id?: true;
    status?: true;
    detail?: true;
    bookingId?: true;
};
export type DisputeMaxAggregateInputType = {
    id?: true;
    status?: true;
    detail?: true;
    bookingId?: true;
};
export type DisputeCountAggregateInputType = {
    id?: true;
    status?: true;
    detail?: true;
    bookingId?: true;
    _all?: true;
};
export type DisputeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DisputeWhereInput;
    orderBy?: Prisma.DisputeOrderByWithRelationInput | Prisma.DisputeOrderByWithRelationInput[];
    cursor?: Prisma.DisputeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DisputeCountAggregateInputType;
    _min?: DisputeMinAggregateInputType;
    _max?: DisputeMaxAggregateInputType;
};
export type GetDisputeAggregateType<T extends DisputeAggregateArgs> = {
    [P in keyof T & keyof AggregateDispute]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDispute[P]> : Prisma.GetScalarType<T[P], AggregateDispute[P]>;
};
export type DisputeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DisputeWhereInput;
    orderBy?: Prisma.DisputeOrderByWithAggregationInput | Prisma.DisputeOrderByWithAggregationInput[];
    by: Prisma.DisputeScalarFieldEnum[] | Prisma.DisputeScalarFieldEnum;
    having?: Prisma.DisputeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DisputeCountAggregateInputType | true;
    _min?: DisputeMinAggregateInputType;
    _max?: DisputeMaxAggregateInputType;
};
export type DisputeGroupByOutputType = {
    id: string;
    status: $Enums.DisputeStatus;
    detail: string;
    bookingId: string;
    _count: DisputeCountAggregateOutputType | null;
    _min: DisputeMinAggregateOutputType | null;
    _max: DisputeMaxAggregateOutputType | null;
};
export type GetDisputeGroupByPayload<T extends DisputeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DisputeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DisputeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DisputeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DisputeGroupByOutputType[P]>;
}>>;
export type DisputeWhereInput = {
    AND?: Prisma.DisputeWhereInput | Prisma.DisputeWhereInput[];
    OR?: Prisma.DisputeWhereInput[];
    NOT?: Prisma.DisputeWhereInput | Prisma.DisputeWhereInput[];
    id?: Prisma.StringFilter<"Dispute"> | string;
    status?: Prisma.EnumDisputeStatusFilter<"Dispute"> | $Enums.DisputeStatus;
    detail?: Prisma.StringFilter<"Dispute"> | string;
    bookingId?: Prisma.StringFilter<"Dispute"> | string;
    booking?: Prisma.XOR<Prisma.BookingScalarRelationFilter, Prisma.BookingWhereInput>;
};
export type DisputeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    detail?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    booking?: Prisma.BookingOrderByWithRelationInput;
};
export type DisputeWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    bookingId?: string;
    AND?: Prisma.DisputeWhereInput | Prisma.DisputeWhereInput[];
    OR?: Prisma.DisputeWhereInput[];
    NOT?: Prisma.DisputeWhereInput | Prisma.DisputeWhereInput[];
    status?: Prisma.EnumDisputeStatusFilter<"Dispute"> | $Enums.DisputeStatus;
    detail?: Prisma.StringFilter<"Dispute"> | string;
    booking?: Prisma.XOR<Prisma.BookingScalarRelationFilter, Prisma.BookingWhereInput>;
}, "id" | "bookingId">;
export type DisputeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    detail?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    _count?: Prisma.DisputeCountOrderByAggregateInput;
    _max?: Prisma.DisputeMaxOrderByAggregateInput;
    _min?: Prisma.DisputeMinOrderByAggregateInput;
};
export type DisputeScalarWhereWithAggregatesInput = {
    AND?: Prisma.DisputeScalarWhereWithAggregatesInput | Prisma.DisputeScalarWhereWithAggregatesInput[];
    OR?: Prisma.DisputeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DisputeScalarWhereWithAggregatesInput | Prisma.DisputeScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Dispute"> | string;
    status?: Prisma.EnumDisputeStatusWithAggregatesFilter<"Dispute"> | $Enums.DisputeStatus;
    detail?: Prisma.StringWithAggregatesFilter<"Dispute"> | string;
    bookingId?: Prisma.StringWithAggregatesFilter<"Dispute"> | string;
};
export type DisputeCreateInput = {
    id?: string;
    status?: $Enums.DisputeStatus;
    detail: string;
    booking: Prisma.BookingCreateNestedOneWithoutDisputeInput;
};
export type DisputeUncheckedCreateInput = {
    id?: string;
    status?: $Enums.DisputeStatus;
    detail: string;
    bookingId: string;
};
export type DisputeUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus;
    detail?: Prisma.StringFieldUpdateOperationsInput | string;
    booking?: Prisma.BookingUpdateOneRequiredWithoutDisputeNestedInput;
};
export type DisputeUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus;
    detail?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type DisputeCreateManyInput = {
    id?: string;
    status?: $Enums.DisputeStatus;
    detail: string;
    bookingId: string;
};
export type DisputeUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus;
    detail?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type DisputeUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus;
    detail?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type DisputeNullableScalarRelationFilter = {
    is?: Prisma.DisputeWhereInput | null;
    isNot?: Prisma.DisputeWhereInput | null;
};
export type DisputeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    detail?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
};
export type DisputeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    detail?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
};
export type DisputeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    detail?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
};
export type DisputeCreateNestedOneWithoutBookingInput = {
    create?: Prisma.XOR<Prisma.DisputeCreateWithoutBookingInput, Prisma.DisputeUncheckedCreateWithoutBookingInput>;
    connectOrCreate?: Prisma.DisputeCreateOrConnectWithoutBookingInput;
    connect?: Prisma.DisputeWhereUniqueInput;
};
export type DisputeUncheckedCreateNestedOneWithoutBookingInput = {
    create?: Prisma.XOR<Prisma.DisputeCreateWithoutBookingInput, Prisma.DisputeUncheckedCreateWithoutBookingInput>;
    connectOrCreate?: Prisma.DisputeCreateOrConnectWithoutBookingInput;
    connect?: Prisma.DisputeWhereUniqueInput;
};
export type DisputeUpdateOneWithoutBookingNestedInput = {
    create?: Prisma.XOR<Prisma.DisputeCreateWithoutBookingInput, Prisma.DisputeUncheckedCreateWithoutBookingInput>;
    connectOrCreate?: Prisma.DisputeCreateOrConnectWithoutBookingInput;
    upsert?: Prisma.DisputeUpsertWithoutBookingInput;
    disconnect?: Prisma.DisputeWhereInput | boolean;
    delete?: Prisma.DisputeWhereInput | boolean;
    connect?: Prisma.DisputeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DisputeUpdateToOneWithWhereWithoutBookingInput, Prisma.DisputeUpdateWithoutBookingInput>, Prisma.DisputeUncheckedUpdateWithoutBookingInput>;
};
export type DisputeUncheckedUpdateOneWithoutBookingNestedInput = {
    create?: Prisma.XOR<Prisma.DisputeCreateWithoutBookingInput, Prisma.DisputeUncheckedCreateWithoutBookingInput>;
    connectOrCreate?: Prisma.DisputeCreateOrConnectWithoutBookingInput;
    upsert?: Prisma.DisputeUpsertWithoutBookingInput;
    disconnect?: Prisma.DisputeWhereInput | boolean;
    delete?: Prisma.DisputeWhereInput | boolean;
    connect?: Prisma.DisputeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DisputeUpdateToOneWithWhereWithoutBookingInput, Prisma.DisputeUpdateWithoutBookingInput>, Prisma.DisputeUncheckedUpdateWithoutBookingInput>;
};
export type EnumDisputeStatusFieldUpdateOperationsInput = {
    set?: $Enums.DisputeStatus;
};
export type DisputeCreateWithoutBookingInput = {
    id?: string;
    status?: $Enums.DisputeStatus;
    detail: string;
};
export type DisputeUncheckedCreateWithoutBookingInput = {
    id?: string;
    status?: $Enums.DisputeStatus;
    detail: string;
};
export type DisputeCreateOrConnectWithoutBookingInput = {
    where: Prisma.DisputeWhereUniqueInput;
    create: Prisma.XOR<Prisma.DisputeCreateWithoutBookingInput, Prisma.DisputeUncheckedCreateWithoutBookingInput>;
};
export type DisputeUpsertWithoutBookingInput = {
    update: Prisma.XOR<Prisma.DisputeUpdateWithoutBookingInput, Prisma.DisputeUncheckedUpdateWithoutBookingInput>;
    create: Prisma.XOR<Prisma.DisputeCreateWithoutBookingInput, Prisma.DisputeUncheckedCreateWithoutBookingInput>;
    where?: Prisma.DisputeWhereInput;
};
export type DisputeUpdateToOneWithWhereWithoutBookingInput = {
    where?: Prisma.DisputeWhereInput;
    data: Prisma.XOR<Prisma.DisputeUpdateWithoutBookingInput, Prisma.DisputeUncheckedUpdateWithoutBookingInput>;
};
export type DisputeUpdateWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus;
    detail?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type DisputeUncheckedUpdateWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus;
    detail?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type DisputeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    status?: boolean;
    detail?: boolean;
    bookingId?: boolean;
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["dispute"]>;
export type DisputeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    status?: boolean;
    detail?: boolean;
    bookingId?: boolean;
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["dispute"]>;
export type DisputeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    status?: boolean;
    detail?: boolean;
    bookingId?: boolean;
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["dispute"]>;
export type DisputeSelectScalar = {
    id?: boolean;
    status?: boolean;
    detail?: boolean;
    bookingId?: boolean;
};
export type DisputeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "status" | "detail" | "bookingId", ExtArgs["result"]["dispute"]>;
export type DisputeInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
};
export type DisputeIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
};
export type DisputeIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
};
export type $DisputePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Dispute";
    objects: {
        booking: Prisma.$BookingPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        status: $Enums.DisputeStatus;
        detail: string;
        bookingId: string;
    }, ExtArgs["result"]["dispute"]>;
    composites: {};
};
export type DisputeGetPayload<S extends boolean | null | undefined | DisputeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DisputePayload, S>;
export type DisputeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DisputeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DisputeCountAggregateInputType | true;
};
export interface DisputeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Dispute'];
        meta: {
            name: 'Dispute';
        };
    };
    findUnique<T extends DisputeFindUniqueArgs>(args: Prisma.SelectSubset<T, DisputeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DisputeClient<runtime.Types.Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DisputeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DisputeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DisputeClient<runtime.Types.Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DisputeFindFirstArgs>(args?: Prisma.SelectSubset<T, DisputeFindFirstArgs<ExtArgs>>): Prisma.Prisma__DisputeClient<runtime.Types.Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DisputeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DisputeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DisputeClient<runtime.Types.Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DisputeFindManyArgs>(args?: Prisma.SelectSubset<T, DisputeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DisputeCreateArgs>(args: Prisma.SelectSubset<T, DisputeCreateArgs<ExtArgs>>): Prisma.Prisma__DisputeClient<runtime.Types.Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DisputeCreateManyArgs>(args?: Prisma.SelectSubset<T, DisputeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DisputeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DisputeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DisputeDeleteArgs>(args: Prisma.SelectSubset<T, DisputeDeleteArgs<ExtArgs>>): Prisma.Prisma__DisputeClient<runtime.Types.Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DisputeUpdateArgs>(args: Prisma.SelectSubset<T, DisputeUpdateArgs<ExtArgs>>): Prisma.Prisma__DisputeClient<runtime.Types.Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DisputeDeleteManyArgs>(args?: Prisma.SelectSubset<T, DisputeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DisputeUpdateManyArgs>(args: Prisma.SelectSubset<T, DisputeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DisputeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DisputeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DisputeUpsertArgs>(args: Prisma.SelectSubset<T, DisputeUpsertArgs<ExtArgs>>): Prisma.Prisma__DisputeClient<runtime.Types.Result.GetResult<Prisma.$DisputePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DisputeCountArgs>(args?: Prisma.Subset<T, DisputeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DisputeCountAggregateOutputType> : number>;
    aggregate<T extends DisputeAggregateArgs>(args: Prisma.Subset<T, DisputeAggregateArgs>): Prisma.PrismaPromise<GetDisputeAggregateType<T>>;
    groupBy<T extends DisputeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DisputeGroupByArgs['orderBy'];
    } : {
        orderBy?: DisputeGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DisputeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDisputeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DisputeFieldRefs;
}
export interface Prisma__DisputeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    booking<T extends Prisma.BookingDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BookingDefaultArgs<ExtArgs>>): Prisma.Prisma__BookingClient<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DisputeFieldRefs {
    readonly id: Prisma.FieldRef<"Dispute", 'String'>;
    readonly status: Prisma.FieldRef<"Dispute", 'DisputeStatus'>;
    readonly detail: Prisma.FieldRef<"Dispute", 'String'>;
    readonly bookingId: Prisma.FieldRef<"Dispute", 'String'>;
}
export type DisputeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DisputeSelect<ExtArgs> | null;
    omit?: Prisma.DisputeOmit<ExtArgs> | null;
    include?: Prisma.DisputeInclude<ExtArgs> | null;
    where: Prisma.DisputeWhereUniqueInput;
};
export type DisputeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DisputeSelect<ExtArgs> | null;
    omit?: Prisma.DisputeOmit<ExtArgs> | null;
    include?: Prisma.DisputeInclude<ExtArgs> | null;
    where: Prisma.DisputeWhereUniqueInput;
};
export type DisputeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DisputeSelect<ExtArgs> | null;
    omit?: Prisma.DisputeOmit<ExtArgs> | null;
    include?: Prisma.DisputeInclude<ExtArgs> | null;
    where?: Prisma.DisputeWhereInput;
    orderBy?: Prisma.DisputeOrderByWithRelationInput | Prisma.DisputeOrderByWithRelationInput[];
    cursor?: Prisma.DisputeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DisputeScalarFieldEnum | Prisma.DisputeScalarFieldEnum[];
};
export type DisputeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DisputeSelect<ExtArgs> | null;
    omit?: Prisma.DisputeOmit<ExtArgs> | null;
    include?: Prisma.DisputeInclude<ExtArgs> | null;
    where?: Prisma.DisputeWhereInput;
    orderBy?: Prisma.DisputeOrderByWithRelationInput | Prisma.DisputeOrderByWithRelationInput[];
    cursor?: Prisma.DisputeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DisputeScalarFieldEnum | Prisma.DisputeScalarFieldEnum[];
};
export type DisputeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DisputeSelect<ExtArgs> | null;
    omit?: Prisma.DisputeOmit<ExtArgs> | null;
    include?: Prisma.DisputeInclude<ExtArgs> | null;
    where?: Prisma.DisputeWhereInput;
    orderBy?: Prisma.DisputeOrderByWithRelationInput | Prisma.DisputeOrderByWithRelationInput[];
    cursor?: Prisma.DisputeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DisputeScalarFieldEnum | Prisma.DisputeScalarFieldEnum[];
};
export type DisputeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DisputeSelect<ExtArgs> | null;
    omit?: Prisma.DisputeOmit<ExtArgs> | null;
    include?: Prisma.DisputeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DisputeCreateInput, Prisma.DisputeUncheckedCreateInput>;
};
export type DisputeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DisputeCreateManyInput | Prisma.DisputeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DisputeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DisputeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DisputeOmit<ExtArgs> | null;
    data: Prisma.DisputeCreateManyInput | Prisma.DisputeCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DisputeIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DisputeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DisputeSelect<ExtArgs> | null;
    omit?: Prisma.DisputeOmit<ExtArgs> | null;
    include?: Prisma.DisputeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DisputeUpdateInput, Prisma.DisputeUncheckedUpdateInput>;
    where: Prisma.DisputeWhereUniqueInput;
};
export type DisputeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DisputeUpdateManyMutationInput, Prisma.DisputeUncheckedUpdateManyInput>;
    where?: Prisma.DisputeWhereInput;
    limit?: number;
};
export type DisputeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DisputeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DisputeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DisputeUpdateManyMutationInput, Prisma.DisputeUncheckedUpdateManyInput>;
    where?: Prisma.DisputeWhereInput;
    limit?: number;
    include?: Prisma.DisputeIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DisputeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DisputeSelect<ExtArgs> | null;
    omit?: Prisma.DisputeOmit<ExtArgs> | null;
    include?: Prisma.DisputeInclude<ExtArgs> | null;
    where: Prisma.DisputeWhereUniqueInput;
    create: Prisma.XOR<Prisma.DisputeCreateInput, Prisma.DisputeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DisputeUpdateInput, Prisma.DisputeUncheckedUpdateInput>;
};
export type DisputeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DisputeSelect<ExtArgs> | null;
    omit?: Prisma.DisputeOmit<ExtArgs> | null;
    include?: Prisma.DisputeInclude<ExtArgs> | null;
    where: Prisma.DisputeWhereUniqueInput;
};
export type DisputeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DisputeWhereInput;
    limit?: number;
};
export type DisputeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DisputeSelect<ExtArgs> | null;
    omit?: Prisma.DisputeOmit<ExtArgs> | null;
    include?: Prisma.DisputeInclude<ExtArgs> | null;
};
