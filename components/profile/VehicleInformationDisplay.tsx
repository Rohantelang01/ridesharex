
"use client";
import { Button } from "@/components/ui/button";
import { Edit, Car, DollarSign, Palette, Calendar, Users, FileText } from "lucide-react";
import { IUser } from "@/types/profile";

interface VehicleInformationDisplayProps {
  profile: IUser;
  onEdit: () => void;
}

const VehicleInformationDisplay = ({ profile, onEdit }: VehicleInformationDisplayProps) => {
  const ownerInfo = profile.ownerInfo;

  if (!ownerInfo || !ownerInfo.vehicles || ownerInfo.vehicles.length === 0) {
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

      {ownerInfo.vehicles.map((vehicle, index) => (
        <div key={index} className="border-t pt-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">
            Vehicle {index + 1}: {vehicle.make} {vehicle.model}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Vehicle Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Plate Number</p>
                  <p className="font-medium">{vehicle.plateNumber || "Not provided"}</p>
                </div>
              </div>
               <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{vehicle.vehicleType || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Palette className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="font-medium">{vehicle.color || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* More Vehicle Details */}
            <div className="space-y-4">
               <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium">{vehicle.year || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Seating Capacity</p>
                  <p className="font-medium">{vehicle.seatingCapacity || "Not provided"} seats</p>
                </div>
              </div>
                <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <div>
                    <p className="text-sm text-gray-500">Rate per KM</p>
                    <p className="font-medium">₹{vehicle.perKmRate}/km</p>
                    </div>
                </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">RC Document</p>
                  <p className="font-medium">
                    {vehicle.rcDocument ? "Uploaded" : "Not uploaded"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Insurance</p>
                  <p className="font-medium">
                    {vehicle.insurance ? "Uploaded" : "Not uploaded"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleInformationDisplay;
