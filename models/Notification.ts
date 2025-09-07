
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IBooking } from './Booking';

// Main Notification Interface
export interface INotification extends Document {
  userId: IUser['_id'];
  type: 'booking_request' | 'booking_accepted' | 'trip_started' | 'trip_completed' | 'payment_received' | 'cancellation' | 'rating_received';
  title: string;
  message: string;
  isRead?: boolean;
  relatedBookingId?: IBooking['_id'];
}

const notificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['booking_request', 'booking_accepted', 'trip_started', 'trip_completed', 'payment_received', 'cancellation', 'rating_received'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  relatedBookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
}, { timestamps: true });

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);
