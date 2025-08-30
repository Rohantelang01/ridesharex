
import mongoose, { Schema, Document } from "mongoose";

// 1. VEHICLE DOCUMENTS SCHEMA
const VehicleDocumentsSchema = new Schema({
  rcImage: { type: String, required: true },
  insuranceImage: { type: String, required: true },
  pollutionImage: { type: String, required: true },
  permitImage: { type: String, required: true }, // For commercial vehicles
});

// 2. MAIN VEHICLE INTERFACE
export interface IVehicle extends Document {
  ownerId: mongoose.Types.ObjectId;
  type: "car" | "bike" | "auto-rickshaw";
  brand: string;
  model: string;
  registrationNumber: string;
  registrationExpiry: Date;
  insuranceExpiry: Date;
  vehicleImages: string[];
  documents: typeof VehicleDocumentsSchema;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 3. MAIN VEHICLE SCHEMA
const VehicleSchema: Schema<IVehicle> = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["car", "bike", "auto-rickshaw"], required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true, trim: true },
    registrationExpiry: { type: Date, required: true },
    insuranceExpiry: { type: Date, required: true },
    vehicleImages: [{ type: String }],
    documents: { type: VehicleDocumentsSchema, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 4. INDEXES
VehicleSchema.index({ ownerId: 1 });
VehicleSchema.index({ registrationNumber: 1 });


export default mongoose.models.Vehicle || mongoose.model<IVehicle>("Vehicle", VehicleSchema);
