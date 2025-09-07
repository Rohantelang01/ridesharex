
import mongoose, { Document, Schema } from 'mongoose';
import { IBooking } from './Booking';

// Interface for Live Tracking
export interface ILiveTracking {
  isActive?: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
    timestamp: Date;
  };
  route?: {
    lat: number;
    lng: number;
    timestamp: Date;
    speed: number;
  }[];
}

// Interface for Approvals
export interface IApprovals {
  passengerApproval?: boolean;
  ownerApproval?: boolean;
}

// Main Trip Interface
export interface ITrip extends Document {
  bookingId: IBooking['_id'];
  liveTracking?: ILiveTracking;
  approvals?: IApprovals;
  completionMethod?: 'auto' | 'manual' | 'passenger_confirmed';
}

const liveTrackingSchema = new Schema<ILiveTracking>({},
  { _id: false });

const approvalsSchema = new Schema<IApprovals>({}, { _id: false });

const tripSchema = new Schema<ITrip>({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  liveTracking: liveTrackingSchema,
  approvals: approvalsSchema,
  completionMethod: { type: String, enum: ['auto', 'manual', 'passenger_confirmed'] },
}, { timestamps: true });

export const Trip = mongoose.models.Trip || mongoose.model<ITrip>('Trip', tripSchema);
