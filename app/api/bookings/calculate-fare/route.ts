
import mongoose, { Document, Schema } from 'mongoose';
import { IWallet, walletSchema } from './Wallet';
import { IVehicle } from './Vehicle'; // Import the new Vehicle interface

// Interface for Permanent Address
export interface IPermanentAddress {
  addressLine1: string;
  addressLine2?: string;
  village?: string;
  tehsil?: string;
  district: string;
  state: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Interface for Current Location
export interface ICurrentLocation {
  address?: string;
  coordinates: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
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
  status?: 'OFFLINE' | 'AVAILABLE' | 'ON_TRIP' | 'SCHEDULED';
  vehicleType?: 'own' | 'rented';
  vehicle?: IVehicle['_id']; // Reference to a vehicle
}

// Interface for Owner Information
export interface IOwnerInfo {
  vehicles: IVehicle['_id'][]; // Array of vehicle references
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
  pincode: { type: String, required: true },
  coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
  }
}, { _id: false });

const currentLocationSchema = new Schema<ICurrentLocation>({
  address: String,
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point', required: true },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  lastUpdated: { type: Date, default: Date.now }
}, { _id: false });

currentLocationSchema.index({ coordinates: '2dsphere' });

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
  status: {
    type: String,
    enum: ['OFFLINE', 'AVAILABLE', 'ON_TRIP', 'SCHEDULED'],
    default: 'OFFLINE'
  },
  vehicleType: {
    type: String,
    enum: ['own', 'rented']
  },
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' }
}, { _id: false });

const ownerInfoSchema = new Schema<IOwnerInfo>({
  vehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }]
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
  password: { type: String, select: false },
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
