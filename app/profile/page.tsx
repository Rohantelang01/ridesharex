
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
  const { user: profile, loading, error, updateSection, fetchProfile, isUpdating, updateProfile } = useProfile();
  const [activeRole, setActiveRole] = useState("passenger");
  const [activeTab, setActiveTab] = useState("personal-information");
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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
      // Handle single role string (User model stores roles as single string)
      const currentRole = profile.roles;
      
      // Set active role based on available role
      if (currentRole === "driver") {
        setActiveRole("driver");
        setActiveTab("driving-information");
      } else if (currentRole === "owner") {
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

  const handleAddRole = async (newRole: 'driver' | 'owner') => {
    try {
      console.log(`Adding new role: ${newRole}`);
      
      if (!profile) {
        console.error('Profile is null, cannot add role');
        alert('Profile not loaded. Please refresh the page and try again.');
        return;
      }
      
      // Since the User model stores roles as a single string, we need to update it directly
      // For now, we'll replace the current role with the new one
      // In a real application, you might want to modify the database schema to support multiple roles
      console.log('Current role:', profile.roles);
      console.log('New role:', newRole);
      
      // Update the user's role in the database using updateProfile for root-level fields
      const updateResult = await updateProfile({ roles: newRole });
      
      if (updateResult) {
        console.log(`${newRole} role added successfully`);
        // Refresh profile data to get updated role
        await fetchProfile();
        
        // Switch to the new role's tab and automatically open edit mode
        if (newRole === "driver") {
          setActiveRole("driver");
          setActiveTab("driving-information");
          setEditingTab("driving-information"); // Automatically open edit mode
        } else if (newRole === "owner") {
          setActiveRole("owner");
          setActiveTab("vehicle-information");
          setEditingTab("vehicle-information"); // Automatically open edit mode
        }
        
        // Show success message and guide user to fill the form
        alert(`${newRole.charAt(0).toUpperCase() + newRole.slice(1)} role added successfully! Please fill in the required information below.`);
      } else {
        console.error(`Failed to add ${newRole} role`);
        alert(`Failed to add ${newRole} role. Please try again.`);
      }
    } catch (err) {
      console.error(`Error adding ${newRole} role:`, err);
      alert(`Error adding ${newRole} role. Please try again.`);
    }
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
        
        // Show success message based on section
        if (section === "driverInfo") {
          setSuccessMessage("Driver information saved successfully! You can now start accepting rides.");
        } else if (section === "ownerInfo") {
          setSuccessMessage("Vehicle owner information saved successfully! You can now manage your vehicles.");
        } else {
          setSuccessMessage("Information saved successfully!");
        }
        setShowSuccessMessage(true);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMessage("");
        }, 5000);
        
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
            profile={profile}
            userRole={[profile.roles]} // Convert single role to array for display
            onRoleChange={handleRoleChange}
            onAddRole={handleAddRole}
            isEditing={editingTab !== null} // Pass editing state
          />

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {successMessage}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setShowSuccessMessage(false)}
                    className="inline-flex text-green-400 hover:text-green-600 dark:hover:text-green-300"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

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
              {profile.roles === "driver" || profile.roles === "owner" ? (
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
              {profile.roles === "owner" ? (
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
