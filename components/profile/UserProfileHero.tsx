
"use client";

import { IUser } from "@/models/User";
import { AtSign, User, Shield, Briefcase, Car } from "lucide-react";

interface UserProfileHeroProps {
  profile: IUser;
}

const UserProfileHero = ({ profile }: UserProfileHeroProps) => {

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'driver':
        return <Car className="w-4 h-4 mr-1.5" />;
      case 'owner':
        return <Briefcase className="w-4 h-4 mr-1.5" />;
      default:
        return <User className="w-4 h-4 mr-1.5" />;
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-slate-800 text-white rounded-xl shadow-2xl p-6 md:p-8 mb-8 overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(107,114,128,0.1),_transparent_30%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_rgba(107,114,128,0.1),_transparent_30%)]"></div>
        
      <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left z-10 relative">
        <div className="relative mb-4 md:mb-0 md:mr-8">
          <img 
            src={profile.profileImage || `https://ui-avatars.com/api/?name=${profile.name.replace(/\s/g, "+")}&background=random&color=fff`}
            alt="Profile Image" 
            className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-slate-700/50 shadow-lg object-cover"
          />
        </div>
        <div className="flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{profile.name}</h1>
          
          <div className="flex items-center justify-center md:justify-start text-lg mt-2 text-slate-300">
            <AtSign className="h-5 w-5 mr-2 text-slate-400" />
            <span>{profile.email}</span>
          </div>
          
          <div className="flex items-center justify-center md:justify-start text-md mt-2 text-slate-400">
            <User className="h-5 w-5 mr-2" />
            <span>{profile.gender}, {profile.age} years old</span>
          </div>
          
          {profile.roles && profile.roles.length > 0 && (
            <div className="mt-5 pt-3 border-t border-slate-700/50 flex flex-wrap justify-center md:justify-start items-center gap-3">
              <h3 className="text-sm font-semibold text-slate-300 mr-2 flex items-center">
                <Shield className="h-5 w-5 mr-1.5 text-slate-400" /> Roles:
              </h3>
              {profile.roles.map((role, index) => (
                <span key={index} className="flex items-center bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-full">
                  {getRoleIcon(role)}
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHero;
