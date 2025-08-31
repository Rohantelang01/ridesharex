"use client";
import { Button } from "@/components/ui/button";
import { Edit, Car, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface VehicleInformationDisplayProps {
  profile: UserProfile;
  onEdit: () => void;
}

const VehicleInformationDisplay = ({ profile, onEdit }: VehicleInformationDisplayProps) => {
  const ownerInfo = profile.ownerInfo;

  if (!ownerInfo) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No vehicle information available</p>
        <Button onClick={onEdit} className="mt-4">
          Add Vehicle Information
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Vehicle Information
        </h3>
        <Button onClick={onEdit} variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Details */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Car className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Can Drive Self</p>
              <p className="font-medium">
                {ownerInfo.canDriveSelf ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Yes
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <XCircle className="w-4 h-4 mr-1" />
                    No
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Car className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Number of Vehicles</p>
              <p className="font-medium">
                {ownerInfo.vehicles ? ownerInfo.vehicles.length : 0} vehicles
              </p>
            </div>
          </div>

          {ownerInfo.vehicles && ownerInfo.vehicles.length > 0 && (
            <div className="flex items-center space-x-3">
              <Car className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Vehicle IDs</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ownerInfo.vehicles.map((vehicleId, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs">
                      {vehicleId.toString().slice(-8)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rate Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Rate Information</h4>
          {ownerInfo.kmRate && Object.keys(ownerInfo.kmRate).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(ownerInfo.kmRate).map(([vehicleType, rate]) => (
                <div key={vehicleType} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {vehicleType}
                  </span>
                  <span className="font-medium">₹{rate}/km</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No rate information available</p>
          )}
        </div>
      </div>

      {/* Driver Information (if owner can drive) */}
      {ownerInfo.canDriveSelf && ownerInfo.driverInfo && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Driver Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Car className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">License Number</p>
                <p className="font-medium">{ownerInfo.driverInfo.licenseNumber || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Hourly Rate</p>
                <p className="font-medium">₹{ownerInfo.driverInfo.hourlyRate || 0}/hr</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleInformationDisplay;
