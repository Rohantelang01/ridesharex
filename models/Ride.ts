
import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IVehicle } from "./Vehicle";

// 1. LOCATION SCHEMA (Embedded)
const LocationSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: String, // Optional descriptive address
});

// 2. FARE SCHEMA (Embedded)
const FareSchema = new Schema({
  base: { type: Number, required: true },
  perKm: { type: Number, required: true },
  perMin: { type: Number, required: true },
  total: { type: Number, required: true },
  driverFare: { type: Number, required: true }, // hour-based
  ownerFare: { type: Number, required: true }, // km-based
  platformFare: { type: Number, required: true },
});

// 3. EXTRA CHARGES SCHEMA (Embedded)
const ExtraChargesSchema = new Schema({
  waiting: { type: Number, default: 0 },
  toll: { type: Number, default: 0 },
  other: { type: Number, default: 0 },
  reason: String,
});

// 4. MAIN RIDE INTERFACE
export interface IRide extends Document {
  rideId: string;
  passengerId: mongoose.Types.ObjectId | IUser;
  driverId: mongoose.Types.ObjectId | IUser;
  ownerId: mongoose.Types.ObjectId | IUser;
  vehicleId: mongoose.Types.ObjectId | IVehicle;
  startLocation: typeof LocationSchema;
  endLocation: typeof LocationSchema;
  distance: number; // in meters
  approxDuration: number; // in seconds
  actualDuration?: number; // in seconds
  actualDistance?: number; // in meters
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  requestedAt: Date;
  startTime?: Date;
  endTime?: Date;
  paymentStatus: "pending" | "held" | "released";
  fare: typeof FareSchema;
  cancelledBy?: "passenger" | "driver" | "owner" | "platform";
  extraCharges?: typeof ExtraChargesSchema;
  createdAt: Date;
  updatedAt: Date;
}

// 5. MAIN RIDE SCHEMA
const RideSchema: Schema<IRide> = new Schema(
  {
    rideId: { type: String, required: true, unique: true },
    passengerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    startLocation: { type: LocationSchema, required: true },
    endLocation: { type: LocationSchema, required: true },
    distance: { type: Number, required: true },
    approxDuration: { type: Number, required: true },
    actualDuration: Number,
    actualDistance: Number,
    status: {
      type: String,
      enum: ["pending", "accepted", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    requestedAt: { type: Date, default: Date.now },
    startTime: Date,
    endTime: Date,
    paymentStatus: {
      type: String,
      enum: ["pending", "held", "released"],
      default: "pending",
    },
    fare: { type: FareSchema, required: true },
    cancelledBy: { type: String, enum: ["passenger", "driver", "owner", "platform"] },
    extraCharges: ExtraChargesSchema,
  },
  { timestamps: true }
);

// 6. INDEXES
RideSchema.index({ rideId: 1 });
RideSchema.index({ passengerId: 1, status: 1 });
RideSchema.index({ driverId: 1, status: 1 });
RideSchema.index({ vehicleId: 1, status: 1 });
RideSchema.index({ startLocation: "2dsphere" });
RideSchema.index({ endLocation: "2dsphere" });


export default mongoose.models.Ride || mongoose.model<IRide>("Ride", RideSchema);
