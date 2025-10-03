"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Define the type for the user profile
interface UserProfile {
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  vehicle?: {
    model: string;
    licensePlate: string;
  };
  wallet?: {
    balance: number;
  };
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        router.push("/login");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const res = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
           const errorData = await res.json();
           // Provide a more specific error message
           throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }

        const data: UserProfile = await res.json();
        setProfile(data);
      } catch (err: any) {
        console.error("Detailed error fetching profile:", err);
        setError(err.message || "Failed to fetch profile. Please try again.");
        toast.error(err.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (loading) {
    return <div className="text-center mt-8">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-500">
        <p>Error: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center mt-8">
        Could not load profile. Please try logging in again.
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={profile.profilePicture}
                alt={profile.name}
              />
              <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <p className="text-gray-500">{profile.email}</p>
              <p className="text-sm font-semibold text-blue-600 capitalize mt-1">
                Role: {profile.role}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {profile.role === "driver" && profile.vehicle && (
            <div className="border-t pt-4">
              <h3 className="font-semibold">Vehicle Information</h3>
              <p>Model: {profile.vehicle.model}</p>
              <p>License Plate: {profile.vehicle.licensePlate}</p>
            </div>
          )}
          {profile.wallet && (
             <div className="border-t pt-4">
               <h3 className="font-semibold">Wallet</h3>
               <p className="text-lg font-bold">Balance: ₹{profile.wallet.balance.toFixed(2)}</p>
             </div>
          )}
          <div className="border-t pt-4">
             <Button onClick={handleLogout} variant="destructive" className="w-full">
               Logout
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import ProfilePage from "@/components/profile/profile";

export default function Page() {
    return <ProfilePage />;
}
