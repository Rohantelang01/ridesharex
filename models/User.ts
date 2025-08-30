
import mongoose, { Schema, Document, HookNextFunction } from "mongoose";

// 1. ADDRESS SCHEMA
const AddressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  pincode: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^\d{6}$/.test(v);
      },
      message: (props: any) => `${props.value} is not a valid pincode!`,
    },
  },
  country: { type: String, default: "India" },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

// 2. DRIVER DOCUMENTS SCHEMA
const DriverDocumentsSchema = new Schema({
  licenseImageFront: { type: String, required: true },
  licenseImageBack: { type: String, required: true },
  aadharImage: { type: String, required: true },
  panImage: { type: String, required: true },
});

// 3. DRIVER INFO SCHEMA
const DriverInfoSchema = new Schema({
  licenseNumber: { type: String, required: true },
  licenseExpiry: { type: Date, required: true },
  experience: { type: Number, required: true, min: 0 }, // years
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRides: { type: Number, default: 0 },
  vehicleTypes: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  driverImage: String,
  documents: { type: DriverDocumentsSchema, required: true },
  hourlyRate: { type: Number, required: true },
  currentRideId: { type: Schema.Types.ObjectId, ref: "Ride" },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

// 4. CANCEL LIST ITEM SCHEMA
const CancelListItemSchema = new Schema({
  rideId: { type: Schema.Types.ObjectId, ref: "Ride", required: true },
  cancelledBy: { type: String, enum: ["passenger", "driver", "owner", "platform"], required: true },
  cancelDate: { type: Date, default: Date.now },
  distanceTravelled: { type: Number, default: 0 },
  driverCharge: { type: Number, default: 0 },
  ownerCharge: { type: Number, default: 0 },
  platformCharge: { type: Number, default: 0 },
  reason: String,
});

// 5. OWNER INFO SCHEMA
const OwnerInfoSchema = new Schema({
  vehicles: [{ type: Schema.Types.ObjectId, ref: "Vehicle" }],
  kmRate: {
    type: Map,
    of: Number, // VehicleType -> Rate
  },
  canDriveSelf: { type: Boolean, default: false },
  driverInfo: {
    type: DriverInfoSchema,
    required: function (this: any) {
      return this.canDriveSelf;
    },
  },
});

// 6. MAIN USER INTERFACE
export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  age: number;
  gender: "male" | "female" | "other";
  profileImage?: string;
  address: {
    homeLocation?: typeof AddressSchema;
    currentLocation?: typeof AddressSchema;
  };
  emergencyContact?: { name: string; phone: string };
  wallet: {
    totalBalance: number;
    addedBalance: number;
    generatedBalance: number;
  };
  cancelList: (typeof CancelListItemSchema)[];
  rideHistory: (mongoose.Types.ObjectId)[];
  roles: "passenger" | "driver" | "owner";
  passengerInfo?: {
    approxRideDuration?: number;
  };
  driverInfo?: typeof DriverInfoSchema;
  ownerInfo?: typeof OwnerInfoSchema;
  createdAt: Date;
  updatedAt: Date;
}

// 7. MAIN USER SCHEMA
const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    profileImage: String,
    address: {
      homeLocation: AddressSchema,
      currentLocation: AddressSchema,
    },
    emergencyContact: {
      name: String,
      phone: String,
    },
    wallet: {
      totalBalance: { type: Number, default: 0 },
      addedBalance: { type: Number, default: 0 },
      generatedBalance: { type: Number, default: 0 },
    },
    cancelList: [CancelListItemSchema],
    rideHistory: [{ type: Schema.Types.ObjectId, ref: "Ride" }],
    roles: {
      type: String,
      enum: ["passenger", "driver", "owner"],
      required: true,
    },
    passengerInfo: {
      approxRideDuration: Number,
    },
    driverInfo: {
      type: DriverInfoSchema,
      required: function (this: IUser) {
        return this.roles === 'driver';
      },
    },
    ownerInfo: {
      type: OwnerInfoSchema,
      required: function (this: IUser) {
        return this.roles === 'owner';
      },
    },
  },
  { timestamps: true }
);

// 8. PRE-SAVE HOOKS
UserSchema.pre<IUser>("save", function (next: HookNextFunction) {
  // Validate driver age
  if (this.roles === 'driver' && this.age < 21) {
    return next(new Error("Driver must be at least 21 years old."));
  }

  // Ensure owner who can drive has driver info
  if (this.roles === 'owner' && this.ownerInfo?.canDriveSelf && !this.ownerInfo.driverInfo) {
    return next(new Error("Owner who can drive must provide driver information."));
  }
  next();
});

// 9. INDEXES
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ "address.currentLocation.location": "2dsphere" });
UserSchema.index({ "driverInfo.location": "2dsphere" });


export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
