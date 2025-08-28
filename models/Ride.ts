import mongoose, { Schema, Document } from "mongoose";

export interface IRide extends Document {
  customerId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  pickup: string;
  drop: string;
  distanceKm: number;
  fare: number;
  status: "pending" | "ongoing" | "completed" | "cancelled";
  startedAt?: Date;
  endedAt?: Date;
}

const RideSchema: Schema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  driverId: { type: Schema.Types.ObjectId, ref: "User" },
  vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
  pickup: { type: String, required: true },
  drop: { type: String, required: true },
  distanceKm: Number,
  fare: Number,
  status: { type: String, enum: ["pending", "ongoing", "completed", "cancelled"], default: "pending" },
  startedAt: Date,
  endedAt: Date,
});

export default mongoose.models.Ride || mongoose.model<IRide>("Ride", RideSchema);
