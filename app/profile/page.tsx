
"use client";
import { useAuth } from "@/hooks/useAuth";
import PersonalInformationForm from "@/components/profile/PersonalInformationForm";
import DrivingInformationForm from "@/components/profile/DrivingInformationForm";
import VehicleInformationForm from "@/components/profile/VehicleInformationForm";
import PaymentsForm from "@/components/profile/PaymentsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {user ? (
        <Tabs defaultValue="personal-information">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal-information">Personal Information</TabsTrigger>
            <TabsTrigger value="driving-information">Driving Information</TabsTrigger>
            <TabsTrigger value="vehicle-information">Vehicle Information</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="personal-information">
            <PersonalInformationForm />
          </TabsContent>
          <TabsContent value="driving-information">
            {user.roles && user.roles.includes("driver") ? (
              <DrivingInformationForm />
            ) : (
              <p>You are not a driver.</p>
            )}
          </TabsContent>
          <TabsContent value="vehicle-information">
            {user.roles && user.roles.includes("owner") ? (
              <VehicleInformationForm />
            ) : (
              <p>You are not an owner.</p>
            )}
          </TabsContent>
          <TabsContent value="payments">
            <PaymentsForm />
          </TabsContent>
        </Tabs>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default ProfilePage;


