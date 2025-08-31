
// components/profile/UserProfileHero.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { User, Camera, Shield, Briefcase } from 'lucide-react';
import { UserProfile } from '@/types/profile';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface UserProfileHeroProps {
  profile: UserProfile;
  activeRole: string;
  userRole: string[]; // It's an array
  onRoleChange: (newRole: string) => void;
}

const UserProfileHero = ({ 
  profile, 
  activeRole,
  userRole,
  onRoleChange 
}: UserProfileHeroProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'user': return <User className="w-4 h-4 mr-2" />;
      case 'owner': return <Briefcase className="w-4 h-4 mr-2" />;
      case 'admin': return <Shield className="w-4 h-4 mr-2" />;
      default: return null;
    }
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center">
        <div className="relative mb-4 md:mb-0 md:mr-6">
          <Image
            src={profile.personalInfo?.profilePicture || '/placeholder-user.jpg'}
            alt="Profile"
            width={128}
            height={128}
            className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
          />
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 rounded-full"
          >
            <Camera className="w-5 h-5" />
          </Button>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
          <p className="text-md text-gray-500 dark:text-gray-400">{profile.email}</p>
          <div className="flex items-center justify-center md:justify-start mt-4">
            {/* Display multiple roles if they exist */}
            {userRole && userRole.length > 0 && (
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activeRole === 'owner'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                >
                  {/* --- THIS IS THE FIX --- */}
                  {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}
                  {/* --- END FIX --- */}
                </span>
              </div>
            )}
           
            {/* Role switcher */}
            {userRole.length > 1 && (
             <div className="ml-4">
                <Select value={activeRole} onValueChange={onRoleChange}>
                  <SelectTrigger className="w-[180px] text-sm">
                    <SelectValue placeholder="Switch role" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRole.map((role) => (
                      <SelectItem key={role} value={role} className="capitalize">
                         {getRoleIcon(role)} {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHero;
