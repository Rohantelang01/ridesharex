"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import PersonalInformationForm from "@/components/profile/PersonalInformationForm";
import DrivingInformationForm from "@/components/profile/DrivingInformationForm";
import VehicleInformationForm from "@/components/profile/VehicleInformationForm";
import PaymentsForm from "@/components/profile/PaymentsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfileHero from "@/components/profile/UserProfileHero";

const ProfilePage = () => {
  const { user } = useAuth();
  const { user: profile, loading, error, updateSection, fetchProfile, isUpdating } = useProfile();
  const [activeRole, setActiveRole] = useState("passenger");
  const [activeTab, setActiveTab] = useState("personal-information");

  // Set active role based on user's role from model
  useEffect(() => {
    if (profile?.roles) {
      // Using 'roles' field from your User model (not 'role')
      if (profile.roles === "driver") {
        setActiveRole("driver");
        setActiveTab("driving-information");
      } else if (profile.roles === "owner") {
        setActiveRole("owner");
        setActiveTab("vehicle-information");
      } else {
        setActiveRole("passenger"); // Using 'passenger' as per your model
        setActiveTab("personal-information");
      }
    }
  }, [profile]);

  const handleRoleChange = (role: string) => {
    setActiveRole(role);
    if (role === "driver") {
      setActiveTab("driving-information");
    } else if (role === "owner") {
      setActiveTab("vehicle-information");
    } else {
      setActiveTab("personal-information");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "driving-information") {
      setActiveRole("driver");
    } else if (tab === "vehicle-information") {
      setActiveRole("owner");
    } else {
      setActiveRole("passenger");
    }
  };

  // Updated save handler for section-wise updates
  const handleSave = async (section: string, updatedData: any) => {
    try {
      const result = await updateSection(section, updatedData);
      if (result) {
        console.log(`${section} section updated successfully`);
        // Optionally show success toast/message
        return { success: true };
      } else {
        console.error(`Error updating ${section} section`);
        return { success: false, error: "Update failed" };
      }
    } catch (err) {
      console.error(`Error updating ${section} section:`, err);
      return { success: false, error: "Update failed" };
    }
  };

  // Personal info save handler
  const handlePersonalSave = async (personalData: any) => {
    return await handleSave("personal", personalData);
  };

  // Driving info save handler
  const handleDrivingSave = async (drivingData: any) => {
    return await handleSave("driver", { driverInfo: drivingData });
  };

  // Vehicle info save handler
  const handleVehicleSave = async (vehicleData: any) => {
    return await handleSave("owner", { ownerInfo: vehicleData });
  };

  // Payments save handler
  const handlePaymentsSave = async (paymentsData: any) => {
    return await handleSave("personal", { wallet: paymentsData.wallet });
  };

  // Loading state with your original styling
  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <p>Loading user data...</p>
      </div>
    </div>
  );

  // Error state
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center text-red-600">
        <p>Error: {error}</p>
        <button 
          onClick={fetchProfile}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {user && profile ? (
        <>
          <UserProfileHero
            activeRole={activeRole}
            onRoleChange={handleRoleChange}
            profile={profile}
            userRole={profile.roles} // Pass actual role from model
          />

          <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-8">
            <TabsList
              className="grid w-full sm:grid-cols-4 overflow-x-auto whitespace-nowrap text-xs sm:text-sm"
              style={{ display: "flex", gap: "8px" }}
            >
              <TabsTrigger value="personal-information">Personal</TabsTrigger>
              <TabsTrigger 
                value="driving-information"
                disabled={profile.roles !== "driver" && profile.roles !== "owner"}
              >
                Driving
              </TabsTrigger>
              <TabsTrigger 
                value="vehicle-information"
                disabled={profile.roles !== "owner"}
              >
                Vehicle
              </TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="personal-information" className="mt-6">
              <PersonalInformationForm 
                data={{
                  name: profile.name,
                  age: profile.age,
                  gender: profile.gender,
                  profileImage: profile.profileImage,
                  emergencyContact: profile.emergencyContact,
                  address: profile.address
                }}
                onSave={handlePersonalSave}
                isLoading={isUpdating}
              />
            </TabsContent>
            
            <TabsContent value="driving-information" className="mt-6">
              {(profile.roles === "driver" || profile.roles === "owner") ? (
                <DrivingInformationForm 
                  data={profile.driverInfo || (profile.ownerInfo?.driverInfo)} // Handle both driver and owner with driver info
                  onSave={handleDrivingSave}
                  isLoading={isUpdating}
                  userRole={profile.roles}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Driving information is only available for drivers and owners</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="vehicle-information" className="mt-6">
              {profile.roles === "owner" ? (
                <VehicleInformationForm 
                  data={profile.ownerInfo}
                  onSave={handleVehicleSave}
                  isLoading={isUpdating}
                  canDriveSelf={profile.ownerInfo?.canDriveSelf}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Vehicle information is only available for vehicle owners</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="payments" className="mt-6">
              <PaymentsForm 
                data={{
                  wallet: profile.wallet,
                  rideHistory: profile.rideHistory,
                  cancelList: profile.cancelList
                }}
                onSave={handlePaymentsSave}
                isLoading={isUpdating}
              />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <p>No user data found</p>
      )}
    </div>
  );
};

export default ProfilePage;