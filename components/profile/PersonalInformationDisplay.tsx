
"use client";
import { IUser } from "@/types/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PersonalInformationDisplayProps {
  profile: IUser;
  onEdit: () => void;
}

const PersonalInformationDisplay = ({ profile, onEdit }: PersonalInformationDisplayProps) => {
  const renderAddress = (address: any, title: string) => {
    if (!address) {
      return <p>{title}: Not provided</p>;
    }
    return (
      <div className="mb-4">
        <p className="font-semibold">{title}</p>
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>{address.village}, {address.tehsil}</p>
        <p>{address.district}, {address.state} - {address.pincode}</p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Personal Information</CardTitle>
        <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Name</p>
            <p>{profile.name}</p>
          </div>
          <div>
            <p className="font-semibold">Age</p>
            <p>{profile.age}</p>
          </div>
          <div>
            <p className="font-semibold">Gender</p>
            <p>{profile.gender}</p>
          </div>
        </div>
        {renderAddress(profile.permanentAddress, "Permanent Address")}
      </CardContent>
    </Card>
  );
};

export default PersonalInformationDisplay;
