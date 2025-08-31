"use client";
import { Button } from "@/components/ui/button";
import { Edit, Car, Calendar, Star, MapPin, DollarSign, FileText } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface DrivingInformationDisplayProps {
  profile: UserProfile;
  onEdit: () => void;
}

const DrivingInformationDisplay = ({ profile, onEdit }: DrivingInformationDisplayProps) => {
  const formatDate = (date: Date | string) => {
    if (!date) return "Not provided";
    return new Date(date).toLocaleDateString();
  };

  const driverInfo = profile.driverInfo || profile.ownerInfo?.driverInfo;

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
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">License Expiry</p>
              <p className="font-medium">{formatDate(driverInfo.licenseExpiry)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Car className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Experience</p>
              <p className="font-medium">{driverInfo.experience || 0} years</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Star className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Rating</p>
              <p className="font-medium">{driverInfo.rating || 0}/5</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Car className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Total Rides</p>
              <p className="font-medium">{driverInfo.totalRides || 0}</p>
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

        {/* Location and Status */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Current Location</p>
              <p className="font-medium">
                {driverInfo.location ? 
                  `${driverInfo.location.lat.toFixed(4)}, ${driverInfo.location.lng.toFixed(4)}` : 
                  "Not provided"
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Car className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  driverInfo.isAvailable ? 
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {driverInfo.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </p>
            </div>
          </div>

          {driverInfo.vehicleTypes && driverInfo.vehicleTypes.length > 0 && (
            <div className="flex items-center space-x-3">
              <Car className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Vehicle Types</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {driverInfo.vehicleTypes.map((type, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Documents</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">License Front</p>
              <p className="font-medium">
                {driverInfo.documents?.licenseImageFront ? "Uploaded" : "Not uploaded"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">License Back</p>
              <p className="font-medium">
                {driverInfo.documents?.licenseImageBack ? "Uploaded" : "Not uploaded"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Aadhar Card</p>
              <p className="font-medium">
                {driverInfo.documents?.aadharImage ? "Uploaded" : "Not uploaded"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">PAN Card</p>
              <p className="font-medium">
                {driverInfo.documents?.panImage ? "Uploaded" : "Not uploaded"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrivingInformationDisplay;
