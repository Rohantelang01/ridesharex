
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import PersonalInformationForm from "@/components/profile/PersonalInformationForm";
import PersonalInformationDisplay from "@/components/profile/PersonalInformationDisplay";
import DrivingInformationForm from "@/components/profile/DrivingInformationForm";
import DrivingInformationDisplay from "@/components/profile/DrivingInformationDisplay";
import VehicleInformationForm from "@/components/profile/VehicleInformationForm";
import VehicleInformationDisplay from "@/components/profile/VehicleInformationDisplay";
import PaymentsForm from "@/components/profile/PaymentsForm";
import PaymentsDisplay from "@/components/profile/PaymentsDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfileHero from "@/components/profile/UserProfileHero";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { user } = useAuth();
  const { user: profile, loading, error, updateSection, fetchProfile, isUpdating } = useProfile();
  const [activeRole, setActiveRole] = useState("passenger");
  const [activeTab, setActiveTab] = useState("personal-information");
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const router = useRouter();

  // --- THIS IS THE FIX ---
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);
  // --- END FIX ---

  useEffect(() => {
    if (profile?.roles) {
      if (profile.roles.includes("driver")) {
        setActiveRole("driver");
        setActiveTab("driving-information");
      } else if (profile.roles.includes("owner")) {
        setActiveRole("owner");
        setActiveTab("vehicle-information");
      } else {
        setActiveRole("passenger");
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
    setEditingTab(null); // Reset editing state when role changes
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
    setEditingTab(null); // Reset editing state when tab changes
  };

  const handleEdit = (tab: string) => {
    setEditingTab(tab);
  };

  const handleCancelEdit = () => {
    setEditingTab(null);
  };

  const handleSave = async (section: string, updatedData: any) => {
    try {
      console.log(`Attempting to update ${section} section with data:`, updatedData);
      const result = await updateSection(section, updatedData);
      console.log(`Update result for ${section}:`, result);
      
      if (result) {
        console.log(`${section} section updated successfully`);
        setEditingTab(null); // Exit edit mode after successful save
        await fetchProfile(); // Refresh profile data
        return { success: true };
      } else {
        console.error(`Error updating ${section} section - updateSection returned false`);
        return { success: false, error: "Update failed - updateSection returned false" };
      }
    } catch (err) {
      console.error(`Error updating ${section} section:`, err);
      return { success: false, error: err instanceof Error ? err.message : "Update failed" };
    }
  };

  const handlePersonalSave = async (personalData: any) => {
    // Update all personal fields at once since they're at the root level of the User model
    const updateResult = await handleSave("", personalData);

    if (updateResult.success) {
      return { success: true };
    } else {
      return { success: false, error: updateResult.error || "Failed to update personal information" };
    }
  };

  const handleDrivingSave = async (drivingData: any) => {
    return await handleSave("driverInfo", drivingData);
  };

  const handleVehicleSave = async (vehicleData: any) => {
    return await handleSave("ownerInfo", vehicleData);
  };

  const handlePaymentsSave = async (paymentsData: any) => {
    return await handleSave("wallet", paymentsData);
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <p>Loading user data...</p>
      </div>
    </div>
  );

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
            userRole={Array.isArray(profile.roles) ? profile.roles : [profile.roles]}
          />

          <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-8">
            <TabsList
              className="grid w-full sm:grid-cols-4 overflow-x-auto whitespace-nowrap text-xs sm:text-sm"
              style={{ display: "flex", gap: "8px" }}
            >
              <TabsTrigger value="personal-information">Personal</TabsTrigger>
              <TabsTrigger 
                value="driving-information"
                disabled={!profile.roles.includes("driver") && !profile.roles.includes("owner")}
              >
                Driving
              </TabsTrigger>
              <TabsTrigger 
                value="vehicle-information"
                disabled={!profile.roles.includes("owner")}
              >
                Vehicle
              </TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="personal-information" className="mt-6">
              {editingTab === "personal-information" ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Edit Personal Information</h3>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                  <PersonalInformationForm 
                    data={{
                      name: profile.name || '',
                      age: profile.age || 18,
                      gender: profile.gender || 'male',
                      profileImage: profile.profileImage || '',
                      emergencyContact: profile.emergencyContact || { name: '', phone: '' },
                      address: profile.address || { homeLocation: undefined, currentLocation: undefined },
                    }}
                    onSave={handlePersonalSave}
                    isLoading={isUpdating}
                  />
                </div>
              ) : (
                <PersonalInformationDisplay
                  profile={profile}
                  onEdit={() => handleEdit("personal-information")}
                />
              )}
            </TabsContent>
            
            <TabsContent value="driving-information" className="mt-6">
              {(profile.roles.includes("driver") || profile.roles.includes("owner")) ? (
                editingTab === "driving-information" ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Edit Driving Information</h3>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                    <DrivingInformationForm 
                      data={profile.driverInfo || (profile.ownerInfo?.driverInfo) || {}}
                      onSave={handleDrivingSave}
                      isLoading={isUpdating}
                      userRole={activeRole}
                    />
                  </div>
                ) : (
                  <DrivingInformationDisplay
                    profile={profile}
                    onEdit={() => handleEdit("driving-information")}
                  />
                )
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Driving information is only available for drivers and owners</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="vehicle-information" className="mt-6">
              {profile.roles.includes("owner") ? (
                editingTab === "vehicle-information" ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Edit Vehicle Information</h3>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                    <VehicleInformationForm 
                      data={profile.ownerInfo || {}}
                      onSave={handleVehicleSave}
                      isLoading={isUpdating}
                      canDriveSelf={profile.ownerInfo?.canDriveSelf || false}
                    />
                  </div>
                ) : (
                  <VehicleInformationDisplay
                    profile={profile}
                    onEdit={() => handleEdit("vehicle-information")}
                  />
                )
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Vehicle information is only available for vehicle owners</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="payments" className="mt-6">
              {editingTab === "payments" ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Edit Payment Information</h3>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                  <PaymentsForm 
                    data={{
                      wallet: profile.wallet || { totalBalance: 0, addedBalance: 0, generatedBalance: 0 }
                    }}
                    onSave={handlePaymentsSave}
                    isLoading={isUpdating}
                  />
                </div>
              ) : (
                <PaymentsDisplay
                  profile={profile}
                  onEdit={() => handleEdit("payments")}
                />
              )}
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
