
// hooks/useProfile.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  IUser, 
  IWallet, 
  ProfileUpdateResponse,
} from '@/types/profile';

// The API returns the user object directly, not nested.
// So, the ProfileResponse is essentially the IUser object with a potential wallet.

interface UseProfileReturn {
  user: IUser | null;
  wallet: IWallet | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<IUser>) => Promise<boolean>;
  updateSection: (section: string, data: any) => Promise<boolean>; // Added this line
  isUpdating: boolean;
}

export const useProfile = (): UseProfileReturn => {
  const [user, setUser] = useState<IUser | null>(null);
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const fetchProfile = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const data: IUser = await response.json();
      setUser(data);

      if ('wallet' in data && data.wallet) {
        setWallet(data.wallet as IWallet);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        fetchProfile();
      } else {
        setLoading(false);
        setUser(null);
        setError("Please log in to view your profile.");
      }
    }
  }, [authLoading, isAuthenticated, fetchProfile]);

  const updateProfile = async (updateData: Partial<IUser>): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data: ProfileUpdateResponse = await response.json();
      setUser(data.user);
      if ('wallet' in data && data.wallet) {
        setWallet(data.wallet as IWallet);
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateSection = async (section: string, sectionData: any): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, data: sectionData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update ${section} section`);
      }

      const data: ProfileUpdateResponse = await response.json();
      setUser(data.user);
      if ('wallet' in data && data.wallet) {
        setWallet(data.wallet as IWallet);
      }
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    user,
    wallet,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateSection, // And this line
    isUpdating,
  };
};
