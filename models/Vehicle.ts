
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IVehicle extends Document {
  owner: IUser['_id'];
  assignedDriver?: IUser['_id']; // Optional: The user assigned to drive this vehicle
  make: string;
  vehicleModel: string; // Changed from model to vehicleModel
  year: number;
  color: string;
  plateNumber: string;
  vehicleType: 'car' | 'bike' | 'auto' | 'bus' | 'truck';
  seatingCapacity: number;
  rcDocument: string;
  insurance: string;
  vehicleImages?: string[];
  perKmRate: number;
  isAvailable: boolean;
}

const vehicleSchema = new Schema<IVehicle>({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedDriver: { type: Schema.Types.ObjectId, ref: 'User' }, // Can be null
  make: { type: String, required: true },
  vehicleModel: { type: String, required: true }, // Changed from model to vehicleModel
  year: { type: Number, required: true },
  color: { type: String, required: true },
  plateNumber: { type: String, required: true, unique: true },
  vehicleType: {
    type: String,
    enum: ['car', 'bike', 'auto', 'bus', 'truck'],
    required: true
  },
  seatingCapacity: { type: Number, required: true },
  rcDocument: { type: String, required: true },
  insurance: { type: String, required: true },
  vehicleImages: [String],
  perKmRate: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export const Vehicle = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', vehicleSchema);
