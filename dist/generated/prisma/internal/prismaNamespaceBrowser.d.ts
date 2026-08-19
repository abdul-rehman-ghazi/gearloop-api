import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
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
