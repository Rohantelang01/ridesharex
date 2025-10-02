
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ITransaction } from './Wallet';

// Interface for Pickup/Dropoff Location
export interface ILocation {
  address: string;
  coordinates: { lat: number; lng: number; };
}

// Interface for Fare calculation
export interface IFare {
  estimatedFare: number; // Based on initial Google Maps estimate
  finalFare?: number;      // Calculated after the trip ends
  platformFee?: number;  // Fee charged by the platform
  driverPayout?: number; // Amount paid to the driver
  ownerPayout?: number;  // Amount paid to the owner
}

// Interface for Payment transaction details
export interface IPayment {
  method: 'WALLET' | 'CASH';
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  amount: number; // Should be equal to finalFare
  transactionRef?: ITransaction['_id']; // Reference to the transaction in the Wallet model
}

// Interface for real-time Trip Data
export interface ITripData {
  startTime?: Date;
  endTime?: Date;
  actualDistance?: number;
  route?: { lat: number; lng: number; timestamp: Date; }[];
}

// Interface for Cancellation details
export interface ICancellation {
  isCancelled: boolean;
  cancelledBy?: 'PASSENGER' | 'DRIVER' | 'OWNER' | 'PLATFORM';
  reason?: string;
  cancellationFee?: number;
  timestamp?: Date;
}

// Main Booking Interface
export interface IBooking extends Document {
  passenger: IUser['_id'];
  driver?: IUser['_id'];
  owner?: IUser['_id'];
  vehicle?: string; // Could be a ref to a Vehicle model later
  bookingType: 'INSTANT' | 'SCHEDULED';
  status: 'REQUESTED' | 'ACCEPTED' | 'ENROUTE' | 'STARTED' | 'COMPLETED' | 'CANCELLED';
  pickup: ILocation;
  dropoff: ILocation;
  scheduledDateTime?: Date; // For scheduled rides
  estimatedDistance?: number;
  estimatedDuration?: number;
  fare: IFare;
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

const fareSchema = new Schema<IFare>({
  estimatedFare: { type: Number, required: true },
  finalFare: Number,
  platformFee: Number,
  driverPayout: Number,
  ownerPayout: Number,
}, { _id: false });

const paymentSchema = new Schema<IPayment>({
  method: { type: String, enum: ['WALLET', 'CASH'], required: true },
  status: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], required: true },
  amount: { type: Number, required: true },
  transactionRef: { type: Schema.Types.ObjectId, ref: 'Transaction' }
}, { _id: false });

const tripDataSchema = new Schema<ITripData>({}, { _id: false });

const cancellationSchema = new Schema<ICancellation>({}, { _id: false });

const bookingSchema = new Schema<IBooking>({
  passenger: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  driver: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  vehicle: { type: String }, // Placeholder
  bookingType: { type: String, enum: ['INSTANT', 'SCHEDULED'], required: true },
  status: {
    type: String,
    enum: ['REQUESTED', 'ACCEPTED', 'ENROUTE', 'STARTED', 'COMPLETED', 'CANCELLED'],
    default: 'REQUESTED',
    index: true
  },
  pickup: { type: locationSchema, required: true },
  dropoff: { type: locationSchema, required: true },
  scheduledDateTime: Date,
  estimatedDistance: Number,
  estimatedDuration: Number,
  fare: { type: fareSchema, required: true },
  payment: paymentSchema,
  tripData: tripDataSchema,
  cancellation: cancellationSchema,
}, { timestamps: true });

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);
