
"use client";
import { Car, Star, DollarSign, FileText } from "lucide-react";
import { IUser } from "@/models/User";

interface DrivingInformationDisplayProps {
  driverInfo: IUser['driverInfo'];
}

const DrivingInformationDisplay = ({ driverInfo }: DrivingInformationDisplayProps) => {

  if (!driverInfo) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No driving information available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
      <div className="flex items-center space-x-3">
        <FileText className="h-6 w-6 text-gray-400" />
        <div>
          <p className="font-semibold">License Number</p>
          <p className="text-gray-900 dark:text-white">{driverInfo.licenseNumber}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Car className="h-6 w-6 text-gray-400" />
        <div>
          <p className="font-semibold">Vehicle Details</p>
          <p className="text-gray-900 dark:text-white">{driverInfo.vehicleDetails}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Star className="h-6 w-6 text-yellow-400" />
        <div>
          <p className="font-semibold">Rating</p>
          <p className="text-gray-900 dark:text-white">{driverInfo.rating?.toFixed(1) ?? 'Not Rated'}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <DollarSign className="h-6 w-6 text-green-500" />
        <div>
          <p className="font-semibold">Rate Per Km</p>
          <p className="text-gray-900 dark:text-white">${driverInfo.ratePerKm?.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default DrivingInformationDisplay;
