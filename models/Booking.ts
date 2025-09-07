
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

// Interface for Shared Data
export interface ISharedData {
  passengerInfo: {
    name: string;
    phone: string;
    email: string;
    currentAddress: string;
  };
  driverInfo: {
    name: string;
    phone: string;
    email: string;
    currentAddress: string;
    hourlyRate: number;
  };
  ownerInfo: {
    name: string;
    phone: string;
    email: string;
    vehicleDetails: object;
    perKmRate: number;
  };
}

// Interface for Pickup/Dropoff
export interface ILocation {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Interface for Fare
export interface IFare {
  driverHourlyRate?: number;
  ownerKmRate?: number;
  platformCommission?: number;
  totalFare?: number;
  estimatedFare?: number;
}

// Interface for Payment
export interface IPayment {
  status: 'pending' | 'blocked' | 'completed' | 'refunded';
  blockedAmount?: number;
  paidToDriver?: number;
  paidToOwner?: number;
  platformFee?: number;
}

// Interface for Trip Data
export interface ITripData {
  startTime?: Date;
  endTime?: Date;
  actualDistance?: number;
  actualDuration?: number;
  route?: {
    lat: number;
    lng: number;
    timestamp: Date;
  }[];
}

// Interface for Cancellation
export interface ICancellation {
  cancelledBy?: IUser['_id'];
  reason?: string;
  cancellationFee?: number;
  refundAmount?: number;
  timestamp?: Date;
}

// Main Booking Interface
export interface IBooking extends Document {
  bookingId: string;
  bookingType: 'instant' | 'advance' | 'planned_trip';
  passengerId: IUser['_id'];
  driverId?: IUser['_id'];
  ownerId?: IUser['_id'];
  vehicleId?: string;
  sharedData?: ISharedData;
  pickup: ILocation;
  dropoff: ILocation;
  scheduledDateTime?: Date;
  estimatedDistance?: number;
  estimatedDuration?: number;
  rideReason?: string;
  status: 'requested' | 'accepted' | 'driver_enroute' | 'trip_started' | 'completed' | 'cancelled';
  acceptanceDeadline?: Date;
  driverAccepted?: boolean;
  ownerAccepted?: boolean;
  fare?: IFare;
  payment?: IPayment;
  tripData?: ITripData;
  cancellation?: ICancellation;
}

const locationSchema = new Schema<ILocation>({
  address: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
}, { _id: false });

const sharedDataSchema = new Schema<ISharedData>({}, { _id: false });

const fareSchema = new Schema<IFare>({}, { _id: false });

const paymentSchema = new Schema<IPayment>({}, { _id: false });

const tripDataSchema = new Schema<ITripData>({}, { _id: false });

const cancellationSchema = new Schema<ICancellation>({}, { _id: false });

const bookingSchema = new Schema<IBooking>({
  bookingId: { type: String, unique: true, required: true },
  bookingType: { type: String, enum: ['instant', 'advance', 'planned_trip'], required: true },
  passengerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'User' },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  vehicleId: String,
  sharedData: sharedDataSchema,
  pickup: { type: locationSchema, required: true },
  dropoff: { type: locationSchema, required: true },
  scheduledDateTime: Date,
  estimatedDistance: Number,
  estimatedDuration: Number,
  rideReason: String,
  status: { type: String, enum: ['requested', 'accepted', 'driver_enroute', 'trip_started', 'completed', 'cancelled'], default: 'requested' },
  acceptanceDeadline: Date,
  driverAccepted: { type: Boolean, default: false },
  ownerAccepted: { type: Boolean, default: false },
  fare: fareSchema,
  payment: paymentSchema,
  tripData: tripDataSchema,
  cancellation: cancellationSchema,
}, { timestamps: true });

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);
