
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IVehicle } from './Vehicle';
import { IWallet } from './Wallet';

// Embedded document for address
export interface IAddress {
  addressLine1: string;
  addressLine2?: string;
  village?: string;
  tehsil?: string;
  district: string;
  state: string;
  pincode: string;
  coordinates?: { lat: number; lng: number };
}

// Embedded document for current location
export interface ICurrentLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// Embedded document for verification details
export interface IVerification {
  isAadhaarVerified: boolean;
  isPanVerified: boolean;
  aadhaarNumber?: string;
  panNumber?: string;
}

// Interface for Driver-specific information
export interface IDriverInfo {
  licenseNumber: string;
  hourlyRate?: number;
  licenseImage?: string;
  idProof?: string;
  status?: 'OFFLINE' | 'AVAILABLE' | 'ON_TRIP' | 'SCHEDULED' | 'UNAVAILABLE';
  rating?: number;
  totalTrips?: number;
  vehicleTypes?: Array<'car' | 'bike' | 'auto' | 'bus' | 'truck'>;
}

// Interface for Owner-specific information
export interface IOwnerInfo {
  vehicles: mongoose.Types.ObjectId[] | IVehicle[];
}

// Interface for public profile information
export interface IPublicInfo {
  rating?: number;
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
  permanentAddress?: IAddress;
  currentLocation?: ICurrentLocation; 
  roles: Array<'passenger' | 'driver' | 'owner'>;
  verification?: IVerification;
  driverInfo?: IDriverInfo;
  ownerInfo?: IOwnerInfo;
  publicInfo?: IPublicInfo;
  wallet?: IWallet;
  isActive?: boolean;
}

// Mongoose Schemas
const addressSchema = new Schema<IAddress>({
  addressLine1: { type: String, required: true },
  addressLine2: String,
  village: String,
  tehsil: String,
  district: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  coordinates: { lat: Number, lng: Number },
});

const currentLocationSchema = new Schema<ICurrentLocation>({
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], required: true }, // [longitude, latitude]
});

const verificationSchema = new Schema<IVerification>({
  isAadhaarVerified: { type: Boolean, default: false },
  isPanVerified: { type: Boolean, default: false },
  aadhaarNumber: String,
  panNumber: String,
});

const driverInfoSchema = new Schema<IDriverInfo>({
  licenseNumber: { type: String, required: true },
  hourlyRate: { type: Number },
  licenseImage: String,
  idProof: String,
  status: {
    type: String,
    enum: ['OFFLINE', 'AVAILABLE', 'ON_TRIP', 'SCHEDULED', 'UNAVAILABLE'],
    default: 'OFFLINE'
  },
  rating: { type: Number, default: 0 },
  totalTrips: { type: Number, default: 0 },
  vehicleTypes: [{
    type: String,
    enum: ['car', 'bike', 'auto', 'bus', 'truck']
  }],
});

const ownerInfoSchema = new Schema<IOwnerInfo>({
  vehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
});

const publicInfoSchema = new Schema<IPublicInfo>({
  rating: { type: Number, default: 0 },
  totalTrips: { type: Number, default: 0 },
  memberSince: { type: Date, default: Date.now },
});

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  profileImage: String,
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  permanentAddress: addressSchema,
  currentLocation: currentLocationSchema,
  roles: [{
    type: String,
    enum: ['passenger', 'driver', 'owner'],
    required: true
  }],
  verification: verificationSchema,
  driverInfo: driverInfoSchema,
  ownerInfo: ownerInfoSchema,
  publicInfo: publicInfoSchema,
  wallet: { type: Schema.Types.ObjectId, ref: 'Wallet' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Index for geospatial queries
userSchema.index({ currentLocation: '2dsphere' });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    // Make sure to pass the error to the next middleware
    if (error instanceof Error) {
       return next(error);
    }
    return next(new Error('Password hashing failed'));
  }
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
