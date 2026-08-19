import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> = [
    PrismaClientOptions
] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? ((Without<T, U> & U) | (Without<U, T> & T)) & object : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly User: "User";
    readonly Listing: "Listing";
    readonly Booking: "Booking";
    readonly PaymentMethod: "PaymentMethod";
    readonly MessageThread: "MessageThread";
    readonly Message: "Message";
    readonly Dispute: "Dispute";
    readonly AdminUser: "AdminUser";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "listing" | "booking" | "paymentMethod" | "messageThread" | "message" | "dispute" | "adminUser";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Listing: {
            payload: Prisma.$ListingPayload<ExtArgs>;
            fields: Prisma.ListingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ListingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ListingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                findFirst: {
                    args: Prisma.ListingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ListingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                findMany: {
                    args: Prisma.ListingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>[];
                };
                create: {
                    args: Prisma.ListingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                createMany: {
                    args: Prisma.ListingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ListingCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>[];
                };
                delete: {
                    args: Prisma.ListingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                update: {
                    args: Prisma.ListingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                deleteMany: {
                    args: Prisma.ListingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ListingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ListingUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>[];
                };
                upsert: {
                    args: Prisma.ListingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                aggregate: {
                    args: Prisma.ListingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateListing>;
                };
                groupBy: {
                    args: Prisma.ListingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ListingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ListingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ListingCountAggregateOutputType> | number;
                };
            };
        };
        Booking: {
            payload: Prisma.$BookingPayload<ExtArgs>;
            fields: Prisma.BookingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BookingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BookingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                findFirst: {
                    args: Prisma.BookingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BookingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                findMany: {
                    args: Prisma.BookingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>[];
                };
                create: {
                    args: Prisma.BookingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                createMany: {
                    args: Prisma.BookingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BookingCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>[];
                };
                delete: {
                    args: Prisma.BookingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                update: {
                    args: Prisma.BookingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                deleteMany: {
                    args: Prisma.BookingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BookingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BookingUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>[];
                };
                upsert: {
                    args: Prisma.BookingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                aggregate: {
                    args: Prisma.BookingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBooking>;
                };
                groupBy: {
                    args: Prisma.BookingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BookingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BookingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BookingCountAggregateOutputType> | number;
                };
            };
        };
        PaymentMethod: {
            payload: Prisma.$PaymentMethodPayload<ExtArgs>;
            fields: Prisma.PaymentMethodFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PaymentMethodFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PaymentMethodFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>;
                };
                findFirst: {
                    args: Prisma.PaymentMethodFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PaymentMethodFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>;
                };
                findMany: {
                    args: Prisma.PaymentMethodFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>[];
                };
                create: {
                    args: Prisma.PaymentMethodCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>;
                };
                createMany: {
                    args: Prisma.PaymentMethodCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PaymentMethodCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>[];
                };
                delete: {
                    args: Prisma.PaymentMethodDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>;
                };
                update: {
                    args: Prisma.PaymentMethodUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>;
                };
                deleteMany: {
                    args: Prisma.PaymentMethodDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PaymentMethodUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PaymentMethodUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>[];
                };
                upsert: {
                    args: Prisma.PaymentMethodUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>;
                };
                aggregate: {
                    args: Prisma.PaymentMethodAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePaymentMethod>;
                };
                groupBy: {
                    args: Prisma.PaymentMethodGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentMethodGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PaymentMethodCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentMethodCountAggregateOutputType> | number;
                };
            };
        };
        MessageThread: {
            payload: Prisma.$MessageThreadPayload<ExtArgs>;
            fields: Prisma.MessageThreadFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MessageThreadFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessageThreadPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MessageThreadFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessageThreadPayload>;
                };
                findFirst: {
                    args: Prisma.MessageThreadFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessageThreadPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MessageThreadFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessageThreadPayload>;
                };
                findMany: {
                    args: Prisma.MessageThreadFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessageThreadPayload>[];
                };
                create: {
                    args: Prisma.MessageThreadCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessageThreadPayload>;
                };
                createMany: {
                    args: Prisma.MessageThreadCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MessageThreadCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessageThreadPayload>[];
                };
                delete: {
                    args: Prisma.MessageThreadDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessageThreadPayload>;
                };
                update: {
                    args: Prisma.MessageThreadUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessageThreadPayload>;
                };
                deleteMany: {
                    args: Prisma.MessageThreadDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MessageThreadUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MessageThreadUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessageThreadPayload>[];
                };
                upsert: {
                    args: Prisma.MessageThreadUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessageThreadPayload>;
                };
                aggregate: {
                    args: Prisma.MessageThreadAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMessageThread>;
                };
                groupBy: {
                    args: Prisma.MessageThreadGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MessageThreadGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MessageThreadCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MessageThreadCountAggregateOutputType> | number;
                };
            };
        };
        Message: {
            payload: Prisma.$MessagePayload<ExtArgs>;
            fields: Prisma.MessageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MessageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                findFirst: {
                    args: Prisma.MessageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                findMany: {
                    args: Prisma.MessageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>[];
                };
                create: {
                    args: Prisma.MessageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                createMany: {
                    args: Prisma.MessageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>[];
                };
                delete: {
                    args: Prisma.MessageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                update: {
                    args: Prisma.MessageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                deleteMany: {
                    args: Prisma.MessageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MessageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>[];
                };
                upsert: {
                    args: Prisma.MessageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                aggregate: {
                    args: Prisma.MessageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMessage>;
                };
                groupBy: {
                    args: Prisma.MessageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MessageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MessageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MessageCountAggregateOutputType> | number;
                };
            };
        };
        Dispute: {
            payload: Prisma.$DisputePayload<ExtArgs>;
            fields: Prisma.DisputeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DisputeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DisputePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DisputeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DisputePayload>;
                };
                findFirst: {
                    args: Prisma.DisputeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DisputePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DisputeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DisputePayload>;
                };
                findMany: {
                    args: Prisma.DisputeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DisputePayload>[];
                };
                create: {
                    args: Prisma.DisputeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DisputePayload>;
                };
                createMany: {
                    args: Prisma.DisputeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DisputeCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DisputePayload>[];
                };
                delete: {
                    args: Prisma.DisputeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DisputePayload>;
                };
                update: {
                    args: Prisma.DisputeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DisputePayload>;
                };
                deleteMany: {
                    args: Prisma.DisputeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DisputeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DisputeUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DisputePayload>[];
                };
                upsert: {
                    args: Prisma.DisputeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DisputePayload>;
                };
                aggregate: {
                    args: Prisma.DisputeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDispute>;
                };
                groupBy: {
                    args: Prisma.DisputeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DisputeGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DisputeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DisputeCountAggregateOutputType> | number;
                };
            };
        };
        AdminUser: {
            payload: Prisma.$AdminUserPayload<ExtArgs>;
            fields: Prisma.AdminUserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AdminUserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdminUserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AdminUserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdminUserPayload>;
                };
                findFirst: {
                    args: Prisma.AdminUserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdminUserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AdminUserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdminUserPayload>;
                };
                findMany: {
                    args: Prisma.AdminUserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdminUserPayload>[];
                };
                create: {
                    args: Prisma.AdminUserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdminUserPayload>;
                };
                createMany: {
                    args: Prisma.AdminUserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AdminUserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdminUserPayload>[];
                };
                delete: {
                    args: Prisma.AdminUserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdminUserPayload>;
                };
                update: {
                    args: Prisma.AdminUserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdminUserPayload>;
                };
                deleteMany: {
                    args: Prisma.AdminUserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AdminUserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AdminUserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdminUserPayload>[];
                };
                upsert: {
                    args: Prisma.AdminUserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdminUserPayload>;
                };
                aggregate: {
                    args: Prisma.AdminUserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAdminUser>;
                };
                groupBy: {
                    args: Prisma.AdminUserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AdminUserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AdminUserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AdminUserCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly initials: "initials";
    readonly isOwner: "isOwner";
    readonly isSuspended: "isSuspended";
    readonly memberSince: "memberSince";
    readonly responseTime: "responseTime";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const ListingScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly category: "category";
    readonly location: "location";
    readonly pricePerDay: "pricePerDay";
    readonly description: "description";
    readonly images: "images";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly ownerId: "ownerId";
};
export type ListingScalarFieldEnum = (typeof ListingScalarFieldEnum)[keyof typeof ListingScalarFieldEnum];
export declare const BookingScalarFieldEnum: {
    readonly id: "id";
    readonly requestNumber: "requestNumber";
    readonly status: "status";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly pickupMethod: "pickupMethod";
    readonly payoutStatus: "payoutStatus";
    readonly createdAt: "createdAt";
    readonly pricePerDayAtBooking: "pricePerDayAtBooking";
    readonly nights: "nights";
    readonly subtotal: "subtotal";
    readonly serviceFee: "serviceFee";
    readonly tax: "tax";
    readonly total: "total";
    readonly listingId: "listingId";
    readonly renterId: "renterId";
    readonly paymentMethodId: "paymentMethodId";
};
export type BookingScalarFieldEnum = (typeof BookingScalarFieldEnum)[keyof typeof BookingScalarFieldEnum];
export declare const PaymentMethodScalarFieldEnum: {
    readonly id: "id";
    readonly brand: "brand";
    readonly last4: "last4";
    readonly expires: "expires";
    readonly processorPaymentMethodId: "processorPaymentMethodId";
    readonly userId: "userId";
};
export type PaymentMethodScalarFieldEnum = (typeof PaymentMethodScalarFieldEnum)[keyof typeof PaymentMethodScalarFieldEnum];
export declare const MessageThreadScalarFieldEnum: {
    readonly id: "id";
    readonly unreadForRenter: "unreadForRenter";
    readonly unreadForOwner: "unreadForOwner";
    readonly createdAt: "createdAt";
    readonly listingId: "listingId";
    readonly renterId: "renterId";
};
export type MessageThreadScalarFieldEnum = (typeof MessageThreadScalarFieldEnum)[keyof typeof MessageThreadScalarFieldEnum];
export declare const MessageScalarFieldEnum: {
    readonly id: "id";
    readonly text: "text";
    readonly sentAt: "sentAt";
    readonly threadId: "threadId";
    readonly senderId: "senderId";
};
export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum];
export declare const DisputeScalarFieldEnum: {
    readonly id: "id";
    readonly status: "status";
    readonly detail: "detail";
    readonly bookingId: "bookingId";
};
export type DisputeScalarFieldEnum = (typeof DisputeScalarFieldEnum)[keyof typeof DisputeScalarFieldEnum];
export declare const AdminUserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly initials: "initials";
    readonly createdAt: "createdAt";
};
export type AdminUserScalarFieldEnum = (typeof AdminUserScalarFieldEnum)[keyof typeof AdminUserScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type EnumListingCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ListingCategory'>;
export type ListEnumListingCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ListingCategory[]'>;
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>;
export type EnumListingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ListingStatus'>;
export type ListEnumListingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ListingStatus[]'>;
export type EnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStatus'>;
export type ListEnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStatus[]'>;
export type EnumPickupMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PickupMethod'>;
export type ListEnumPickupMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PickupMethod[]'>;
export type EnumPayoutStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PayoutStatus'>;
export type ListEnumPayoutStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PayoutStatus[]'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type EnumCardBrandFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CardBrand'>;
export type ListEnumCardBrandFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CardBrand[]'>;
export type EnumDisputeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DisputeStatus'>;
export type ListEnumDisputeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DisputeStatus[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export interface PrismaClientBaseOptions {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
    queryPlanCacheMaxSize?: number;
}
export interface PrismaClientOptionsWithAccelerateUrl extends PrismaClientBaseOptions {
    accelerateUrl: string;
    adapter?: never;
}
export interface PrismaClientOptionsWithAdapter extends PrismaClientBaseOptions {
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
}
export type PrismaClientOptions = PrismaClientOptionsWithAccelerateUrl | PrismaClientOptionsWithAdapter;
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    listing?: Prisma.ListingOmit;
    booking?: Prisma.BookingOmit;
    paymentMethod?: Prisma.PaymentMethodOmit;
    messageThread?: Prisma.MessageThreadOmit;
    message?: Prisma.MessageOmit;
    dispute?: Prisma.DisputeOmit;
    adminUser?: Prisma.AdminUserOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
