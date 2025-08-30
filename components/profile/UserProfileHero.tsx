
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserProfileHeroProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

const UserProfileHero = ({ showForm, setShowForm }: UserProfileHeroProps) => {
  const { user } = useAuth();

  return (
    <div className="bg-card shadow-md rounded-lg p-4 flex items-center space-x-4 mb-8">
      <Avatar className="h-16 w-16">
        <AvatarImage src={user?.profileImage} alt={user?.name} />
        <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h2 className="text-xl font-bold">{user?.name}</h2>
        <p className="text-muted-foreground">{user?.email}</p>
      </div>
      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Complete Your Profile"}
      </Button>
    </div>
  );
};

export default UserProfileHero;
