// app/components/navbar/UserProfile.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, UserPlus, LogIn, Shield, Car, Map } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface UserProfileProps {
  isMobile?: boolean;
  onActionClick?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isMobile = false, onActionClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      onActionClick?.();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getDashboardLink = () => {
    if (!user?.role) return '/dashboard';
    return `/dashboard/${user.role}`;
  };

  // Mobile version
  if (isMobile) {
    if (isAuthenticated && user) {
      return (
        <div className="space-y-1">
          {/* User Info */}
          <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium',
              AuthService.getAvatarColor(user.name)
            )}>
              {AuthService.getUserInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              {user.role && (
                <p className="text-xs text-blue-600 dark:text-blue-400 capitalize">{user.role}</p>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <Link
            href="/profile"
            className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={onActionClick}
          >
            <User className="w-5 h-5" />
            <span>Your Profile</span>
          </Link>

          <Link
            href={getDashboardLink()}
            className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={onActionClick}
          >
            <Shield className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/settings"
            className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={onActionClick}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>

          <hr className="my-2 border-gray-200 dark:border-gray-700" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      );
    }

    // Not authenticated - mobile
    return (
      <div className="space-y-1">
        <Link
          href="/login"
          className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={onActionClick}
        >
          <LogIn className="w-5 h-5" />
          <span>Login</span>
        </Link>
        <Link
          href="/signup"
          className="flex items-center space-x-3 px-3 py-3 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          onClick={onActionClick}
        >
          <UserPlus className="w-5 h-5" />
          <span>Sign Up</span>
        </Link>
      </div>
    );
  }

  // Desktop version
  if (isAuthenticated && user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium',
            AuthService.getAvatarColor(user.name)
          )}>
            {AuthService.getUserInitials(user.name)}
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-white font-medium',
                  AuthService.getAvatarColor(user.name)
                )}>
                  {AuthService.getUserInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  {user.role && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 capitalize mt-1">{user.role}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href="/profile"
                className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Your Profile</span>
              </Link>

              <Link
                href={getDashboardLink()}
                className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Shield className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/settings"
                className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>

              <hr className="my-2 border-gray-200 dark:border-gray-700" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not authenticated - desktop
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Auth Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <Link
            href="/login"
            className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsDropdownOpen(false)}
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
          <Link
            href="/signup"
            className="flex items-center space-x-3 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            onClick={() => setIsDropdownOpen(false)}
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
