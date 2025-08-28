import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  rideId: mongoose.Types.ObjectId;
  method: string;
  amount: number;
  split: { driver: number; owner: number; platform: number };
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema({
  rideId: { type: Schema.Types.ObjectId, ref: "Ride", required: true },
  method: { type: String, enum: ["UPI", "Paytm", "Debit Card", "Credit Card"], required: true },
  amount: { type: Number, required: true },
  split: {
    driver: Number,
    owner: Number,
    platform: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
