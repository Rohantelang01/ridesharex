// types/profile.ts

// Base address type
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

// Driver documents type
export interface DriverDocuments {
  licenseImageFront: string;
  licenseImageBack: string;
  aadharImage: string;
  panImage: string;
}

// Driver info type
export interface DriverInfo {
  licenseNumber: string;
  licenseExpiry: Date | string;
  experience: number;
  rating?: number;
  totalRides?: number;
  vehicleTypes?: string[];
  isAvailable?: boolean;
  driverImage?: string;
  documents: DriverDocuments;
  hourlyRate: number;
  currentRideId?: string;
  location: {
    lat: number;
    lng: number;
  };
}

// Owner info type
export interface OwnerInfo {
  vehicles?: string[];
  kmRate?: Map<string, number>;
  canDriveSelf?: boolean;
  driverInfo?: DriverInfo;
}

// Emergency contact type
export interface EmergencyContact {
  name: string;
  phone: string;
}

// Wallet type
export interface Wallet {
  totalBalance: number;
  addedBalance: number;
  generatedBalance: number;
}

// Main user profile type
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  profileImage?: string;
  address: {
    homeLocation?: Address;
    currentLocation?: Address;
  };
  emergencyContact?: EmergencyContact;
  wallet: Wallet;
  cancelList: any[];
  rideHistory: string[];
  roles: 'passenger' | 'driver' | 'owner';
  passengerInfo?: {
    approxRideDuration?: number;
  };
  driverInfo?: DriverInfo;
  ownerInfo?: OwnerInfo;
  createdAt: Date;
  updatedAt: Date;
}

// Form data types for each section
export interface PersonalFormData {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  profileImage?: string;
  emergencyContact?: EmergencyContact;
}

export interface AddressFormData {
  homeLocation?: Address;
  currentLocation?: Address;
}

export interface DriverFormData {
  driverInfo: DriverInfo;
}

export interface VehicleFormData {
  ownerInfo: OwnerInfo;
}

export interface PaymentFormData {
  // Add payment specific fields if needed
  wallet?: Wallet;
}

// API response types
export interface ProfileResponse {
  success: boolean;
  user: UserProfile;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

export interface ProfileErrorResponse {
  error: string;
  details?: string[];
}

// Form validation schemas (for client-side validation)
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

// Personal info validation
export const personalInfoValidation: ValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  age: {
    required: true,
    min: 18,
    max: 100
  },
  gender: {
    required: true
  },
  'emergencyContact.name': {
    minLength: 2,
    maxLength: 50
  },
  'emergencyContact.phone': {
    pattern: /^[6-9]\d{9}$/
  }
};

// Address validation
export const addressValidation: ValidationSchema = {
  street: {
    minLength: 5,
    maxLength: 100
  },
  city: {
    minLength: 2,
    maxLength: 50
  },
  state: {
    minLength: 2,
    maxLength: 50
  },
  pincode: {
    pattern: /^\d{6}$/
  },
  'location.lat': {
    required: true,
    min: -90,
    max: 90
  },
  'location.lng': {
    required: true,
    min: -180,
    max: 180
  }
};

// Driver info validation
export const driverInfoValidation: ValidationSchema = {
  licenseNumber: {
    required: true,
    minLength: 10,
    maxLength: 20
  },
  licenseExpiry: {
    required: true,
    custom: (date: Date) => {
      return new Date(date) > new Date() || 'License expiry date must be in future';
    }
  },
  experience: {
    required: true,
    min: 0,
    max: 50
  },
  hourlyRate: {
    required: true,
    min: 50,
    max: 2000
  },
  'location.lat': {
    required: true,
    min: -90,
    max: 90
  },
  'location.lng': {
    required: true,
    min: -180,
    max: 180
  }
};

// Upload file type
export interface FileUpload {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  error?: string;
}

// Form state type
export interface FormState<T> {
  data: T;
  loading: boolean;
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  isValid: boolean;
  isDirty: boolean;
}