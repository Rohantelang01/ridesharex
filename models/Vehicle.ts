import mongoose, { Schema, Document } from "mongoose";

export interface IVehicle extends Document {
  ownerId: mongoose.Types.ObjectId;
  type: string;
  vehicleModel: string;
  regNumber: string;
  city: string;
  pricePerKm: number;
  images: string[];
  available: boolean;
  createdAt: Date;
}

const VehicleSchema: Schema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Sedan", "SUV", "Bike", "Auto", "Bus"], required: true },
  vehicleModel: { type: String, required: true },
  regNumber: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  pricePerKm: { type: Number, required: true },
  images: [{ type: String }],
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema);
