
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IBooking } from './Booking';

// This sub-document will store the history of every transaction.
export interface ITransaction extends Document {
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  walletType: 'GENERATED' | 'ADDED';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'BLOCKED' | 'REFUNDED';
  description: string;
  relatedBooking?: IBooking['_id'];
  timestamp: Date;
}

const transactionSchema = new Schema<ITransaction>({
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['CREDIT', 'DEBIT'], 
    required: true 
  },
  walletType: { 
    type: String, 
    enum: ['GENERATED', 'ADDED'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'BLOCKED', 'REFUNDED'], 
    default: 'COMPLETED' 
  },
  description: { type: String, required: true },
  relatedBooking: { type: Schema.Types.ObjectId, ref: 'Booking' },
  timestamp: { type: Date, default: Date.now },
});


// This is the main Wallet interface for each user.
export interface IWallet extends Document {
  user: IUser['_id'];
  // For earnings & refunds. This balance is withdrawable.
  generatedBalance: number; 
  // For funds added by the user. This is non-withdrawable and used for booking trips.
  addedBalance: number; 
  transactions: ITransaction[];
}


const walletSchema = new Schema<IWallet>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  generatedBalance: { type: Number, default: 0, min: 0 },
  addedBalance: { type: Number, default: 0, min: 0 },
  transactions: [transactionSchema],
}, { timestamps: true });


export const Wallet = mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', walletSchema);
