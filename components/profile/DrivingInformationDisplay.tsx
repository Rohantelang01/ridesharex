
"use client";
import { Button } from "@/components/ui/button";
import { Edit, Car, Star, DollarSign, FileText } from "lucide-react";
import { IUser } from "@/types/profile";

interface DrivingInformationDisplayProps {
  profile: IUser;
  onEdit: () => void;
}

const DrivingInformationDisplay = ({ profile, onEdit }: DrivingInformationDisplayProps) => {

  const driverInfo = profile.driverInfo;

  if (!driverInfo) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No driving information available</p>
        <Button onClick={onEdit} className="mt-4">
          Add Driving Information
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Driving Information
        </h3>
        <Button onClick={onEdit} variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Driving Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Car className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">License Number</p>
              <p className="font-medium">{driverInfo.licenseNumber || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DollarSign className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Hourly Rate</p>
              <p className="font-medium">₹{driverInfo.hourlyRate || 0}/hr</p>
            </div>
          </div>
        </div>

        {/* Status and Vehicle Type*/}
        <div className="space-y-4">
            <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-gray-500" />
                <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                        driverInfo.isOnline ? 
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {driverInfo.isOnline ? 'Online' : 'Offline'}
                        </span>
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-gray-500" />
                <div>
                    <p className="text-sm text-gray-500">Vehicle Type</p>
                    <p className="font-medium">{driverInfo.vehicleType || "Not provided"}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Documents</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">License</p>
              <p className="font-medium">
                {driverInfo.licenseImage ? "Uploaded" : "Not uploaded"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">ID Proof</p>
              <p className="font-medium">
                {driverInfo.idProof ? "Uploaded" : "Not uploaded"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrivingInformationDisplay;
