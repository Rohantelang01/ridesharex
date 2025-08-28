"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    roles: {
        passenger: { type: Boolean, default: true },
        driver: { type: Boolean, default: false },
        owner: { type: Boolean, default: false },
    },
    passengerInfo: {
        preferredPayment: { type: String, enum: ["UPI", "Paytm", "Card"], default: "UPI" },
    },
    driverInfo: {
        licenseNumber: String,
        licenseImage: String,
        profileImage: String,
        vehiclePreference: String,
    },
    ownerInfo: {
        aadhaarNumber: String,
        aadhaarImage: String,
    },
    createdAt: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.models.User || mongoose_1.default.model("User", UserSchema);
