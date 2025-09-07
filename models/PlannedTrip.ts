
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

// Interface for Passenger
export interface IPassenger {
  passengerId: IUser['_id'];
  bookedAt: Date;
  seatNumber: number;
}

// Main Planned Trip Interface
export interface IPlannedTrip extends Document {
  ownerId: IUser['_id'];
  vehicleId: string;
  title: string;
  route: {
    pickup: {
      address: string;
      coordinates: { lat: number, lng: number };
    };
    dropoff: {
      address: string;
      coordinates: { lat: number, lng: number };
    };
  };
  scheduledDateTime: Date;
  seatsAvailable: number;
  seatsBooked: number;
  farePerSeat: number;
  passengers: IPassenger[];
  status: 'active' | 'completed' | 'cancelled';
}

const passengerSchema = new Schema<IPassenger>({
  passengerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookedAt: { type: Date, default: Date.now },
  seatNumber: { type: Number, required: true }
}, { _id: false });

const plannedTripSchema = new Schema<IPlannedTrip>({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: String, required: true },
  title: { type: String, required: true },
  route: {
    pickup: {
      address: { type: String, required: true },
      coordinates: { lat: { type: Number, required: true }, lng: { type: Number, required: true } }
    },
    dropoff: {
      address: { type: String, required: true },
      coordinates: { lat: { type: Number, required: true }, lng: { type: Number, required: true } }
    }
  },
  scheduledDateTime: { type: Date, required: true },
  seatsAvailable: { type: Number, required: true },
  seatsBooked: { type: Number, default: 0 },
  farePerSeat: { type: Number, required: true },
  passengers: [passengerSchema],
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
}, { timestamps: true });

export const PlannedTrip = mongoose.models.PlannedTrip || mongoose.model<IPlannedTrip>('PlannedTrip', plannedTripSchema);
