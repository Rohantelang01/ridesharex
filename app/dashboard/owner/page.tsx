
"use client";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import VehicleInformationForm from "@/components/profile/VehicleInformationForm";
import UserProfileHero from "@/components/profile/UserProfileHero";
import { IUser, IOwnerInfo } from "@/types/profile";

const OwnerPage = () => {
  const { user, loading, error, updateSection, isUpdating } = useProfile();
  const [canDriveSelf, setCanDriveSelf] = useState(false);

  useEffect(() => {
    if (user?.ownerInfo?.canDriveSelf) {
      setCanDriveSelf(user.ownerInfo.canDriveSelf);
    }
  }, [user]);

  const handleSave = async (data: IOwnerInfo) => {
    const result = await updateSection("ownerInfo", data);
    if (result) {
      // Success case
    } else {
      // Error case
    }
    return { success: result };
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfileHero user={user as IUser} />
      <div className="mt-8">
        <VehicleInformationForm
          data={user?.ownerInfo}
          onSave={handleSave}
          isLoading={isUpdating}
          canDriveSelf={canDriveSelf}
        />
      </div>
    </div>
  );
};

export default OwnerPage;
