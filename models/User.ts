
import mongoose, { Document, Schema } from 'mongoose';
import { IWallet, walletSchema } from './Wallet';

// Interface for Permanent Address
export interface IPermanentAddress {
  addressLine1: string;
  addressLine2?: string;
  village?: string;
  tehsil?: string;
  district: string;
  state: string;
  pincode: string;
}

// Interface for Current Location
export interface ICurrentLocation {
  address?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  lastUpdated?: Date;
}

// Interface for Verification
export interface IVerification {
  email?: boolean;
  phone?: boolean;
  kyc?: boolean;
}

// Interface for Driver Information
export interface IDriverInfo {
  licenseNumber?: string;
  licenseImage?: string;
  idProof?: string;
  hourlyRate?: number;
  isOnline?: boolean;
  vehicleType?: 'own' | 'rented';
}

// Interface for Vehicle
export interface IVehicle {
  vehicleId?: string;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  plateNumber?: string;
  vehicleType?: 'car' | 'bike' | 'auto' | 'bus' | 'truck';
  seatingCapacity?: number;
  rcDocument?: string;
  insurance?: string;
  vehicleImages?: string[];
  perKmRate: number;
  isAvailable?: boolean;
}

// Interface for Owner Information
export interface IOwnerInfo {
  vehicles?: IVehicle[];
}

// Interface for Public Information
export interface IPublicInfo {
  rating?: {
    average?: number;
    totalRatings?: number;
  };
  totalTrips?: number;
  memberSince?: Date;
}

// Main User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password?: string;
  profileImage?: string;
  age: number;
  gender: string;
  permanentAddress?: IPermanentAddress;
  currentLocation?: ICurrentLocation;
  roles: Array<'passenger' | 'driver' | 'owner'>;
  verification?: IVerification;
  driverInfo?: IDriverInfo;
  ownerInfo?: IOwnerInfo;
  publicInfo?: IPublicInfo;
  wallet?: IWallet;
  isActive?: boolean;
  lastLogin?: Date;
}

const permanentAddressSchema = new Schema<IPermanentAddress>({
  addressLine1: { type: String, required: true },
  addressLine2: String,
  village: String,
  tehsil: String,
  district: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true }
}, { _id: false });

const currentLocationSchema = new Schema<ICurrentLocation>({
  address: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  lastUpdated: { type: Date, default: Date.now }
}, { _id: false });

const verificationSchema = new Schema<IVerification>({
  email: { type: Boolean, default: false },
  phone: { type: Boolean, default: false },
  kyc: { type: Boolean, default: false }
}, { _id: false });

const driverInfoSchema = new Schema<IDriverInfo>({
  licenseNumber: String,
  licenseImage: String,
  idProof: String,
  hourlyRate: { type: Number, default: 0 },
  isOnline: { type: Boolean, default: false },
  vehicleType: {
    type: String,
    enum: ['own', 'rented']
  }
}, { _id: false });

const vehicleSchema = new Schema<IVehicle>({
  vehicleId: String,
  make: String,
  model: String,
  year: Number,
  color: String,
  plateNumber: String,
  vehicleType: {
    type: String,
    enum: ['car', 'bike', 'auto', 'bus', 'truck']
  },
  seatingCapacity: Number,
  rcDocument: String,
  insurance: String,
  vehicleImages: [String],
  perKmRate: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true }
}, { _id: false });

const ownerInfoSchema = new Schema<IOwnerInfo>({
  vehicles: [vehicleSchema]
}, { _id: false });

const publicInfoSchema = new Schema<IPublicInfo>({
  rating: {
    average: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
  },
  totalTrips: { type: Number, default: 0 },
  memberSince: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  profileImage: { type: String, default: null },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  permanentAddress: { type: permanentAddressSchema, required: false },
  currentLocation: currentLocationSchema,
  roles: [{ type: String, enum: ['passenger', 'driver', 'owner'], default: ['passenger'] }],
  verification: verificationSchema,
  driverInfo: driverInfoSchema,
  ownerInfo: ownerInfoSchema,
  publicInfo: publicInfoSchema,
  wallet: walletSchema,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
