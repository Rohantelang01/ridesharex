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
}

const UserProfileHero = ({ activeRole, onRoleChange }: UserProfileHeroProps) => {
  const { user } = useAuth();

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-2xl font-bold">{user?.displayName}</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center w-full md:w-auto gap-3">
          <p className="text-sm font-medium whitespace-nowrap">Viewing as:</p>
          <Select value={activeRole} onValueChange={onRoleChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rider">Rider</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHero;
