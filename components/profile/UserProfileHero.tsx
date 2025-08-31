"use client";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProfileHeroProps {
  activeRole: string;
  onRoleChange: (role: string) => void;
  profile?: {
    name?: string;
    email?: string;
    profileImage?: string;
    roles?: 'passenger' | 'driver' | 'owner';
  };
  userRole?: 'passenger' | 'driver' | 'owner';
}

const UserProfileHero = ({ activeRole, onRoleChange, profile, userRole }: UserProfileHeroProps) => {
  const { user } = useAuth();

  // Use profile data if available, otherwise fallback to auth user
  const displayName = profile?.name || user?.displayName || "User";
  const displayEmail = profile?.email || user?.email || "";
  const displayImage = profile?.profileImage || user?.photoURL || "";
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-6 md:pb-8">
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4 md:gap-6">
        {/* Avatar + Name + Email + Viewing as all in one row */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3 md:gap-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16 md:h-24 md:w-24 border-4 border-background">
            <AvatarImage src={displayImage} alt={displayName} />
            <AvatarFallback className="text-lg md:text-xl font-semibold">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>

          {/* Name + Email + Role Badge */}
          <div className="flex flex-col">
            <p className="text-lg md:text-2xl font-bold">{displayName}</p>
            <p className="text-xs md:text-base text-muted-foreground">{displayEmail}</p>
            {userRole && (
              <div className="mt-1">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  userRole === 'driver' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : userRole === 'owner'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
              </div>
            )}
          </div>

          {/* Viewing As */}
          <div className="flex items-center gap-2 md:gap-3 ml-auto">
            <p className="text-xs md:text-sm font-medium whitespace-nowrap">Viewing as:</p>
            <Select value={activeRole} onValueChange={onRoleChange}>
              <SelectTrigger className="w-32 md:w-48 text-xs md:text-sm">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passenger">Passenger</SelectItem>
                <SelectItem 
                  value="driver" 
                  disabled={userRole !== 'driver' && userRole !== 'owner'}
                >
                  Driver
                </SelectItem>
                <SelectItem 
                  value="owner" 
                  disabled={userRole !== 'owner'}
                >
                  Owner
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Profile Completion Status */}
      {profile && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Profile Completion</p>
              <p className="text-xs text-muted-foreground">
                Complete your profile to access all features
              </p>
            </div>
            <div className="text-right">
              {/* You can calculate completion percentage here based on filled fields */}
              <p className="text-sm font-semibold">
                {profile.name && profile.email ? '60%' : '40%'}
              </p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileHero;