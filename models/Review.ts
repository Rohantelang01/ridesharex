
import mongoose, { Document, Schema } from 'mongoose';
import { IBooking } from './Booking';
import { IUser } from './User';

// Main Review Interface
export interface IReview extends Document {
  bookingId: IBooking['_id'];
  reviewerId: IUser['_id'];
  revieweeId: IUser['_id'];
  rating: number;
  comment?: string;
  reviewType: 'passenger_to_driver' | 'passenger_to_owner' | 'driver_to_passenger' | 'owner_to_passenger';
  isPublic?: boolean;
}

const reviewSchema = new Schema<IReview>({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  revieweeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 500 },
  reviewType: { type: String, enum: ['passenger_to_driver', 'passenger_to_owner', 'driver_to_passenger', 'owner_to_passenger'], required: true },
  isPublic: { type: Boolean, default: true },
}, { timestamps: true });

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
