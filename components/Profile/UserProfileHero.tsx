
// components/Profile/UserProfileHero.tsx
import React from 'react';
import { IUser } from '@/models/User';
import { FaUserCircle, FaPlus } from 'react-icons/fa';

interface UserProfileHeroProps {
  profile: IUser;
  activeRole: string;
  onRoleChange: (role: string) => void;
  onAddRole: (role: 'driver' | 'owner') => void;
  isEditing: boolean;
}

// A mapping from role name to a more user-friendly, capitalized version.
const ROLE_DISPLAY_NAMES: { [key: string]: string } = {
  passenger: 'Passenger',
  driver: 'Driver',
  owner: 'Owner',
};

// Helper to capitalize the first letter of a string
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const UserProfileHero: React.FC<UserProfileHeroProps> = ({ 
  profile, 
  activeRole, 
  onRoleChange, 
  onAddRole,
  isEditing 
}) => {
  const availableRoles = ['passenger', 'driver', 'owner'];
  const canAddDriver = !profile.roles.includes('driver');
  const canAddOwner = !profile.roles.includes('owner');

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center">
        <div className="relative mb-4 md:mb-0 md:mr-6">
          {profile.profileImage ? (
            <img src={profile.profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
          ) : (
            <FaUserCircle className="w-32 h-32 text-gray-400" />
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
          <p className="text-gray-600 dark:text-gray-300">{profile.email}</p>
          
          {/* FIX: Display all roles as badges instead of a dropdown */}
          <div className="mt-4 flex items-center justify-center md:justify-start gap-2 flex-wrap">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Roles:</span>
            {profile.roles.map(role => (
              <span key={role} className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {ROLE_DISPLAY_NAMES[role] || capitalize(role)}
              </span>
            ))}
          </div>

        </div>
        {!isEditing && (
          <div className="mt-4 md:mt-0 flex flex-col items-center gap-2">
            {canAddDriver && (
              <button 
                onClick={() => onAddRole('driver')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FaPlus /> Become a Driver
              </button>
            )}
            {canAddOwner && (
              <button 
                onClick={() => onAddRole('owner')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <FaPlus /> Become an Owner
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileHero;
