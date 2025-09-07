
"use client";
import { Button } from "@/components/ui/button";
import { Edit, User, MapPin, Phone, Calendar, Image as ImageIcon } from "lucide-react";
import { IUser } from "@/types/profile";

interface PersonalInformationDisplayProps {
  profile: IUser;
  onEdit: () => void;
}

const PersonalInformationDisplay = ({ profile, onEdit }: PersonalInformationDisplayProps) => {
  const formatDate = (date: Date | string) => {
    if (!date) return "Not provided";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Personal Information
        </h3>
        <Button onClick={onEdit} variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{profile.name || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-medium">{profile.age || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ImageIcon className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Profile Image</p>
              <p className="font-medium">
                {profile.profileImage ? "Image uploaded" : "No image uploaded"}
              </p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Permanent Address</h4>
          {profile.permanentAddress ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Address Line 1</p>
                  <p className="font-medium">{profile.permanentAddress.addressLine1 || "Not provided"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">District</p>
                  <p className="font-medium">{profile.permanentAddress.district || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="font-medium">{profile.permanentAddress.state || "Not provided"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Pincode</p>
                  <p className="font-medium">{profile.permanentAddress.pincode || "Not provided"}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No address information provided</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationDisplay;
