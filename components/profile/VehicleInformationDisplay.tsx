
"use client";
import { Car, DollarSign, Palette, Calendar, Users, FileText } from "lucide-react";
import { IUser } from "@/types/profile";

interface VehicleInformationDisplayProps {
  ownerInfo: IUser['ownerInfo'];
}

const VehicleInformationDisplay = ({ ownerInfo }: VehicleInformationDisplayProps) => {

  if (!ownerInfo || !ownerInfo.vehicles || ownerInfo.vehicles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No vehicle information available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {ownerInfo.vehicles.map((vehicle, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 shadow-inner">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b pb-3">
            Vehicle {index + 1}: {vehicle.make} {vehicle.model}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Core Vehicle Details */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Car className="w-6 h-6 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Plate Number</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{vehicle.plateNumber || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Car className="w-6 h-6 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{vehicle.vehicleType || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Column 2: Specs */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Palette className="w-6 h-6 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Color</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{vehicle.color || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-6 h-6 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Year</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{vehicle.year || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Column 3: Capacity & Rate */}
            <div className="space-y-4">
                <div className="flex items-start space-x-3">
                    <Users className="w-6 h-6 text-gray-400 mt-1" />
                    <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Seating Capacity</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{vehicle.seatingCapacity ? `${vehicle.seatingCapacity} seats` : "Not provided"}</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                    <DollarSign className="w-6 h-6 text-green-500 mt-1" />
                    <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rate per KM</p>
                    <p className="font-semibold text-gray-800 dark:text-white">₹{vehicle.perKmRate}/km</p>
                    </div>
                </div>
            </div>
            
            {/* Documents Section */}
            <div className="md:col-span-2 lg:col-span-3 border-t dark:border-gray-700 mt-4 pt-4">
                 <h5 className="text-md font-semibold text-gray-800 dark:text-white mb-3">Documents</h5>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-gray-400" />
                        <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">RC Document</p>
                        <p className={`font-semibold ${vehicle.rcDocument ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {vehicle.rcDocument ? "Uploaded" : "Not uploaded"}
                        </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-gray-400" />
                        <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Insurance</p>
                         <p className={`font-semibold ${vehicle.insurance ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {vehicle.insurance ? "Uploaded" : "Not uploaded"}
                        </p>
                        </div>
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
