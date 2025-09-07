
// types/profile.ts
export interface IWallet {
  totalBalance: number;
  addedBalance: number;
  generatedBalance: number;
}

export interface IPermanentAddress {
  addressLine1: string;
  addressLine2?: string;
  village?: string;
  tehsil?: string;
  district: string;
  state: string;
  pincode: string;
}

export interface ICurrentLocation {
  address?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  lastUpdated?: Date;
}

export interface IVerification {
  email?: boolean;
  phone?: boolean;
  kyc?: boolean;
}

export interface IDriverInfo {
  licenseNumber?: string;
  licenseImage?: string;
  idProof?: string;
  hourlyRate?: number;
  isOnline?: boolean;
  vehicleType?: 'own' | 'rented';
}

export interface IVehicle {
  vehicleId?: string;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  plateNumber?: string;
  vehicleType?: 'car' | 'bike' | 'auto' | 'bus' | 'truck';
  seatingCapacity?: number;
  rcDocument?: string;
  insurance?: string;
  vehicleImages?: string[];
  perKmRate: number;
  isAvailable?: boolean;
}

export interface IOwnerInfo {
  vehicles?: IVehicle[];
}

export interface IPublicInfo {
  rating?: {
    average?: number;
    totalRatings?: number;
  };
  totalTrips?: number;
  memberSince?: Date;
}

export interface IUser {
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  age: number;
  permanentAddress: IPermanentAddress;
  currentLocation?: ICurrentLocation;
  roles: Array<'passenger' | 'driver' | 'owner'>;
  verification?: IVerification;
  driverInfo?: IDriverInfo;
  ownerInfo?: IOwnerInfo;
  publicInfo?: IPublicInfo;
  wallet?: IWallet;
  isActive?: boolean;
  lastLogin?: Date;
}
