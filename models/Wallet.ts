
import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
  totalBalance: number;
  addedBalance: number;
  generatedBalance: number;
}

export const walletSchema = new Schema<IWallet>({
  totalBalance: { type: Number, default: 0 },
  addedBalance: { type: Number, default: 0 },
  generatedBalance: { type: Number, default: 0 },
});

export const Wallet = mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', walletSchema);
