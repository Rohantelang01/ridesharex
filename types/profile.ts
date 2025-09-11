
export interface IAddress {
  addressLine1: string;
  addressLine2?: string;
  village?: string;
  tehsil?: string;
  district: string;
  state: string;
  pincode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IUser {
  name: string;
  age: number;
  gender: string;
  profileImage?: string;
  roles: string[];
  permanentAddress?: IAddress;
  driverInfo?: any; 
  ownerInfo?: any;
  wallet?: any;
}
