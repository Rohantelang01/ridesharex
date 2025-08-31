
// components/profile/UserProfileHero.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { User, Camera, Shield, Briefcase, Plus, Car, Building } from 'lucide-react';
import { UserProfile } from '@/types/profile';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserProfileHeroProps {
  profile: UserProfile;
  activeRole: string;
  userRole: string[]; // It's an array
  onRoleChange: (newRole: string) => void;
  onAddRole?: (role: 'driver' | 'owner') => void;
  isEditing?: boolean; // Add this prop to show editing state
}

const UserProfileHero = ({ 
  profile, 
  activeRole,
  userRole,
  onRoleChange,
  onAddRole 
}: UserProfileHeroProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNewRole, setSelectedNewRole] = useState<string>('');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'user': return <User className="w-4 h-4 mr-2" />;
      case 'driver': return <Car className="w-4 h-4 mr-2" />;
      case 'owner': return <Building className="w-4 h-4 mr-2" />;
      case 'admin': return <Shield className="w-4 h-4 mr-2" />;
      default: return null;
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'driver': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'owner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'passenger': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'driver': return 'Drive vehicles and earn money by providing rides';
      case 'owner': return 'Own vehicles and manage them, can also drive if needed';
      case 'passenger': return 'Book rides and travel to your destination';
      default: return '';
    }
  }

  // Get profile image from the correct field
  const getProfileImage = () => {
    if (profile.profileImage) {
      return profile.profileImage;
    }
    return '/placeholder-user.jpg';
  };

  const handleAddRole = () => {
    if (selectedNewRole && onAddRole) {
      onAddRole(selectedNewRole as 'driver' | 'owner');
      setSelectedNewRole('');
    }
  };

  const availableRoles = ['driver', 'owner'].filter(role => !userRole.includes(role));
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center">
        <div className="relative mb-4 md:mb-0 md:mr-6">
          <Image
            src={getProfileImage()}
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
        
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
          <p className="text-md text-gray-500 dark:text-gray-400">{profile.email}</p>
          
          <div className="flex items-center justify-center md:justify-start mt-4 space-x-2">
            {/* Display current roles */}
            {userRole && userRole.length > 0 && (
              userRole.map((role) => (
                <span
                  key={role}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(role)}`}
                >
                  {getRoleIcon(role)} {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              ))
            )}
            
            {/* Add new role button */}
            {availableRoles.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Role
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                    <DialogDescription>
                      Choose a new role to expand your capabilities on the platform.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      {availableRoles.map((role) => (
                        <div
                          key={role}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedNewRole === role
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                          onClick={() => setSelectedNewRole(role)}
                        >
                          <div className="flex items-center space-x-3">
                            {getRoleIcon(role)}
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                                {role}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {getRoleDescription(role)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedNewRole && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          You'll need to provide additional information for the <strong className="capitalize">{selectedNewRole}</strong> role.
                        </p>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={handleAddRole}
                            className="flex-1"
                          >
                            Add {selectedNewRole.charAt(0).toUpperCase() + selectedNewRole.slice(1)} Role
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedNewRole('')}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {/* Show helpful message when editing */}
          {isEditing && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                📝 Please fill in all the required information for your new role. This information is necessary to activate your account as a {activeRole}.
              </p>
            </div>
          )}
           
          {/* Role switcher for existing roles */}
          {userRole.length > 1 && (
            <div className="mt-4">
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
  );
};

export default UserProfileHero;
