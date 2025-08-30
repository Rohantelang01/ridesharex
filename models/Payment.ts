
import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  rideId: mongoose.Types.ObjectId;
  passengerId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  totalAmount: number;
  holdAmount: number;
  releasedToDriver: number;
  releasedToOwner: number;
  platformShare: number;
  extraPaymentSettled: boolean;
  status: "pending" | "held" | "processed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    rideId: { type: Schema.Types.ObjectId, ref: "Ride", required: true },
    passengerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalAmount: { type: Number, required: true },
    holdAmount: { type: Number, default: 0 },
    releasedToDriver: { type: Number, default: 0 },
    releasedToOwner: { type: Number, default: 0 },
    platformShare: { type: Number, default: 0 },
    extraPaymentSettled: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "held", "processed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

PaymentSchema.index({ rideId: 1 });
PaymentSchema.index({ passengerId: 1 });
PaymentSchema.index({ driverId: 1 });
PaymentSchema.index({ ownerId: 1 });

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
