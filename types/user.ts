// types/user.ts
export interface Address {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface Wallet {
  totalBalance: number;
  addedBalance: number;
  generatedBalance: number;
}

export interface PassengerInfo {
  approxRideDuration?: number;
}

export interface DriverDocuments {
  licenseImageFront: string;
  licenseImageBack: string;
  aadharImage: string;
  panImage: string;
}

export interface DriverInfo {
  licenseNumber: string;
  licenseExpiry: Date;
  experience: number;
  rating: number;
  totalRides: number;
  vehicleTypes: string[];
  isAvailable: boolean;
  driverImage?: string;
  documents: DriverDocuments;
  hourlyRate: number;
  currentRideId?: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface OwnerInfo {
  vehicles: string[];
  kmRate: Map<string, number>;
  canDriveSelf: boolean;
  driverInfo?: DriverInfo;
}

export interface CancelListItem {
  rideId: string;
  cancelledBy: 'passenger' | 'driver' | 'owner' | 'platform';
  cancelDate: Date;
  distanceTravelled: number;
  driverCharge: number;
  ownerCharge: number;
  platformCharge: number;
  reason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  profileImage?: string;
  role: 'passenger' | 'driver' | 'owner';
  address: {
    homeLocation?: Address;
    currentLocation?: Address;
  };
  emergencyContact?: EmergencyContact;
  wallet: Wallet;
  cancelList: CancelListItem[];
  rideHistory: string[];
  passengerInfo?: PassengerInfo;
  driverInfo?: DriverInfo;
  ownerInfo?: OwnerInfo;
  createdAt: string;
  updatedAt: string;
}

// Form data types
export interface PersonalInfoFormData {
  name: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  emergencyContact?: EmergencyContact;
}

export interface AddressFormData {
  homeLocation?: Partial<Address>;
  currentLocation?: Partial<Address>;
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  profileImage?: string;
  address?: AddressFormData;
  emergencyContact?: EmergencyContact;
  passengerInfo?: PassengerInfo;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProfileApiResponse extends ApiResponse<User> {}

export interface UpdateProfileResponse extends ApiResponse<User> {
  message: string;
}