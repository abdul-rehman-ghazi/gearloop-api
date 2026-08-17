"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBookingPricing = calculateBookingPricing;
const client_1 = require("../../generated/prisma/client");
const SERVICE_FEE_RATE = '0.10';
const TAX_RATE = '0.08';
function calculateBookingPricing(pricePerDay, nights) {
    const subtotal = new client_1.Prisma.Decimal(pricePerDay).mul(nights);
    const serviceFee = subtotal.mul(SERVICE_FEE_RATE);
    const tax = subtotal.plus(serviceFee).mul(TAX_RATE);
    const total = subtotal.plus(serviceFee).plus(tax);
    return { subtotal, serviceFee, tax, total };
}
//# sourceMappingURL=booking-pricing.util.js.map