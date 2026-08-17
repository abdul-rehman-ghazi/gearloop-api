export declare const ListingCategory: {
    readonly Cameras: "Cameras";
    readonly PowerTools: "PowerTools";
    readonly Bikes: "Bikes";
    readonly CampingGear: "CampingGear";
};
export type ListingCategory = (typeof ListingCategory)[keyof typeof ListingCategory];
export declare const ListingStatus: {
    readonly active: "active";
    readonly paused: "paused";
    readonly pending: "pending";
    readonly rejected: "rejected";
};
export type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus];
export declare const BookingStatus: {
    readonly pending: "pending";
    readonly confirmed: "confirmed";
    readonly completed: "completed";
    readonly cancelled: "cancelled";
};
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
export declare const PayoutStatus: {
    readonly pending: "pending";
    readonly paid: "paid";
    readonly on_hold: "on_hold";
};
export type PayoutStatus = (typeof PayoutStatus)[keyof typeof PayoutStatus];
export declare const PickupMethod: {
    readonly pickup: "pickup";
    readonly delivery: "delivery";
};
export type PickupMethod = (typeof PickupMethod)[keyof typeof PickupMethod];
export declare const DisputeStatus: {
    readonly flagged: "flagged";
    readonly under_review: "under_review";
    readonly resolved: "resolved";
};
export type DisputeStatus = (typeof DisputeStatus)[keyof typeof DisputeStatus];
export declare const CardBrand: {
    readonly Visa: "Visa";
    readonly Mastercard: "Mastercard";
};
export type CardBrand = (typeof CardBrand)[keyof typeof CardBrand];
