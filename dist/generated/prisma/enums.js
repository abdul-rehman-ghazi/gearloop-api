"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardBrand = exports.DisputeStatus = exports.PickupMethod = exports.PayoutStatus = exports.BookingStatus = exports.ListingStatus = exports.ListingCategory = void 0;
exports.ListingCategory = {
    Cameras: 'Cameras',
    PowerTools: 'PowerTools',
    Bikes: 'Bikes',
    CampingGear: 'CampingGear'
};
exports.ListingStatus = {
    active: 'active',
    paused: 'paused',
    pending: 'pending',
    rejected: 'rejected'
};
exports.BookingStatus = {
    pending: 'pending',
    confirmed: 'confirmed',
    completed: 'completed',
    cancelled: 'cancelled'
};
exports.PayoutStatus = {
    pending: 'pending',
    paid: 'paid',
    on_hold: 'on_hold'
};
exports.PickupMethod = {
    pickup: 'pickup',
    delivery: 'delivery'
};
exports.DisputeStatus = {
    flagged: 'flagged',
    under_review: 'under_review',
    resolved: 'resolved'
};
exports.CardBrand = {
    Visa: 'Visa',
    Mastercard: 'Mastercard'
};
//# sourceMappingURL=enums.js.map