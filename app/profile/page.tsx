"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import PersonalInformationForm from "@/components/profile/PersonalInformationForm";
import DrivingInformationForm from "@/components/profile/DrivingInformationForm";
import VehicleInformationForm from "@/components/profile/VehicleInformationForm";
import PaymentsForm from "@/components/profile/PaymentsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfileHero from "@/components/profile/UserProfileHero";

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeRole, setActiveRole] = useState("rider");
  const [activeTab, setActiveTab] = useState("personal-information");

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
      setActiveRole("rider");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {user ? (
        <>
          <UserProfileHero
            activeRole={activeRole}
            onRoleChange={handleRoleChange}
          />
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-8">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="personal-information">Personal</TabsTrigger>
              <TabsTrigger value="driving-information">Driving</TabsTrigger>
              <TabsTrigger value="vehicle-information">Vehicle</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
            <TabsContent value="personal-information" className="mt-6">
              <PersonalInformationForm />
            </TabsContent>
            <TabsContent value="driving-information" className="mt-6">
              {user.roles && user.roles.includes("driver") ? (
                <DrivingInformationForm />
              ) : (
                <div>
                  <p className="mb-4 text-sm md:text-base">Please fill out the form to become a driver.</p>
                  <DrivingInformationForm />
                </div>
              )}
            </TabsContent>
            <TabsContent value="vehicle-information" className="mt-6">
              {user.roles && user.roles.includes("owner") ? (
                <VehicleInformationForm />
              ) : (
                <div>
                  <p className="mb-4 text-sm md:text-base">Please fill out the form to become an owner.</p>
                  <VehicleInformationForm />
                </div>
              )}
            </TabsContent>
            <TabsContent value="payments" className="mt-6">
              <PaymentsForm />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default ProfilePage;
