import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  rideId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  seats: number;
  amount: number;
  status: "confirmed" | "cancelled";
}

const BookingSchema: Schema = new Schema({
  rideId: { type: Schema.Types.ObjectId, ref: "Ride", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  seats: { type: Number, default: 1 },
  amount: Number,
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
});

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
