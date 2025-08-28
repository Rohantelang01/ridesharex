import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
  password: string;
  city: string;
  roles: { passenger: boolean; driver: boolean; owner: boolean };
  passengerInfo: { preferredPayment?: string };
  driverInfo?: {
    licenseNumber?: string;
    licenseImage?: string; 
    profileImage?: string; 
    vehiclePreference?: string;
  };
  ownerInfo?: { aadhaarNumber?: string; aadhaarImage?: string };
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
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

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
