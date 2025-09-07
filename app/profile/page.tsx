
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
  const [isAddingRole, setIsAddingRole] = useState<'driver' | 'owner' | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    if (profile?.roles) {
      const currentRole = Array.isArray(profile.roles) ? profile.roles[0] : profile.roles;
      
      if (!isAddingRole) {
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
    }
  }, [profile, isAddingRole]);

  const handleRoleChange = (role: string) => {
    setActiveRole(role);
    if (role === "driver") {
      setActiveTab("driving-information");
    } else if (role === "owner") {
      setActiveTab("vehicle-information");
    } else {
      setActiveTab("personal-information");
    }
    setEditingTab(null); 
    setIsAddingRole(null);
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
    setEditingTab(null);
    setIsAddingRole(null);
  };

  const handleEdit = (tab: string) => {
    setEditingTab(tab);
  };

  const handleCancelEdit = () => {
    setEditingTab(null);
    setIsAddingRole(null);
    // If canceling adding a role, revert to the user's actual current role
    if (profile) {
      const currentRole = Array.isArray(profile.roles) ? profile.roles[0] : profile.roles;
      handleRoleChange(currentRole || 'passenger');
    }
  };

  const handleAddRole = (newRole: 'driver' | 'owner') => {
    if (!profile) {
      alert('Profile not loaded. Please refresh and try again.');
      return;
    }

    // Prevent adding a role that already exists
    if (profile.roles.includes(newRole)) {
      alert(`You already have the ${newRole} role.`);
      return;
    }

    setIsAddingRole(newRole);
    setActiveRole(newRole);
    if (newRole === "driver") {
      setActiveTab("driving-information");
    } else if (newRole === "owner") {
      setActiveTab("vehicle-information");
    }
    setEditingTab(null); // Close any other editing forms
    
    // Immediately show the form for the new role
    // The `TabsContent` will now be rendered because `isAddingRole` is set
  };

  const handleSave = async (section: string, updatedData: any, newRole: string | null = null) => {
    try {
      let dataToSend = { ...updatedData };
      let endpoint = section ? 'section' : 'profile';

      if (newRole) {
        // When adding a new role, we send the role and the new data together
        dataToSend = {
          roles: [newRole, ...profile.roles],
          [section]: updatedData
        };
        endpoint = 'profile'; // Use the full profile update endpoint
      }
      
      console.log(`Attempting to update ${endpoint} with data:`, dataToSend);

      const result = endpoint === 'section' 
        ? await updateSection(section, dataToSend)
        : await updateProfile(dataToSend);

      console.log(`Update result for ${endpoint}:`, result);
      
      if (result) {
        console.log(`${section || 'Profile'} updated successfully`);
        setEditingTab(null);
        setIsAddingRole(null);
        await fetchProfile(); // Refresh profile data
        
        let successMsg = "Information saved successfully!";
        if (newRole) {
          successMsg = `${newRole.charAt(0).toUpperCase() + newRole.slice(1)} role added successfully!`;
        } else if (section === "driverInfo") {
          successMsg = "Driver information saved successfully!";
        } else if (section === "ownerInfo") {
          successMsg = "Vehicle owner information saved successfully!";
        }

        setSuccessMessage(successMsg);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
        
        return { success: true };
      } else {
        console.error(`Error updating ${section} - API call returned false`);
        return { success: false, error: "Update failed - API returned unsuccessful" };
      }
    } catch (err) {
      console.error(`Error updating ${section}:`, err);
      return { success: false, error: err instanceof Error ? err.message : "Update failed" };
    }
  };

  const handlePersonalSave = async (personalData: any) => {
    return await handleSave("", personalData);
  };

  const handleDrivingSave = async (drivingData: any) => {
    const newRole = isAddingRole === 'driver' ? 'driver' : null;
    return await handleSave("driverInfo", drivingData, newRole);
  };

  const handleVehicleSave = async (vehicleData: any) => {
    const newRole = isAddingRole === 'owner' ? 'owner' : null;
    return await handleSave("ownerInfo", vehicleData, newRole);
  };

  const handlePaymentsSave = async (paymentsData: any) => {
    return await handleSave("wallet", paymentsData);
  };

  if (loading) return <div className="text-center py-8">Loading user data...</div>;

  if (error) return (
    <div className="text-center text-red-600 py-8">
      <p>Error: {error}</p>
      <button onClick={fetchProfile} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Retry</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {user && profile ? (
        <>
          <UserProfileHero
            activeRole={activeRole}
            profile={profile}
            userRole={profile.roles} // Pass the roles array directly
            onRoleChange={handleRoleChange}
            onAddRole={handleAddRole}
            isEditing={editingTab !== null || isAddingRole !== null}
          />

          {showSuccessMessage && (
            <div className="my-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded relative" role="alert">
              <span className="block sm:inline">{successMessage}</span>
              <button onClick={() => setShowSuccessMessage(false)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
              </button>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-8">
            <TabsList className="grid w-full sm:grid-cols-4">
              <TabsTrigger value="personal-information">Personal</TabsTrigger>
              <TabsTrigger value="driving-information" disabled={!profile.roles.includes('driver') && !profile.roles.includes('owner') && !isAddingRole}>Driving</TabsTrigger>
              <TabsTrigger value="vehicle-information" disabled={!profile.roles.includes('owner') && !isAddingRole}>Vehicle</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="personal-information">
              {editingTab === "personal-information" ? (
                <PersonalInformationForm data={profile} onSave={handlePersonalSave} isLoading={isUpdating} />
              ) : (
                <PersonalInformationDisplay profile={profile} onEdit={() => handleEdit("personal-information")} />
              )}
            </TabsContent>
            
            <TabsContent value="driving-information">
              {(profile.roles.includes('driver') || isAddingRole === 'driver') ? (
                (editingTab === "driving-information" || isAddingRole === 'driver') ? (
                  <DrivingInformationForm 
                    data={profile.driverInfo || {}}
                    onSave={handleDrivingSave}
                    isLoading={isUpdating}
                    userRole={activeRole}
                    onCancel={handleCancelEdit}
                  />
                ) : (
                  <DrivingInformationDisplay profile={profile} onEdit={() => handleEdit("driving-information")} />
                )
              ) : (
                <div className="text-center py-8"><p>Driving information is for drivers.</p></div>
              )}
            </TabsContent>
            
            <TabsContent value="vehicle-information">
              {(profile.roles.includes('owner') || isAddingRole === 'owner') ? (
                (editingTab === "vehicle-information" || isAddingRole === 'owner') ? (
                  <VehicleInformationForm 
                    data={profile.ownerInfo || {}}
                    onSave={handleVehicleSave}
                    isLoading={isUpdating}
                    canDriveSelf={profile.ownerInfo?.canDriveSelf || false}
                    onCancel={handleCancelEdit}
                  />
                ) : (
                  <VehicleInformationDisplay profile={profile} onEdit={() => handleEdit("vehicle-information")} />
                )
              ) : (
                <div className="text-center py-8"><p>Vehicle information is for vehicle owners.</p></div>
              )}
            </TabsContent>
            
            <TabsContent value="payments">
              {editingTab === "payments" ? (
                <PaymentsForm data={profile} onSave={handlePaymentsSave} isLoading={isUpdating} />
              ) : (
                <PaymentsDisplay profile={profile} onEdit={() => handleEdit("payments")} />
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
