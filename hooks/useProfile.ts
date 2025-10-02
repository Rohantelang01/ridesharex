
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
  profile: IUser | null; // Changed from 'user' to 'profile' for clarity
  wallet: IWallet | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<IUser>) => Promise<boolean>;
  updateSection: (section: string, data: any) => Promise<boolean>;
  isUpdating: boolean;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<IUser | null>(null); // Changed from 'user' to 'profile'
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, loading: authLoading } = useAuth(); // Use 'token' to check auth status

  const fetchProfile = useCallback(async (): Promise<void> => {
    if (!token) {
      setLoading(false);
      setError("Authentication token not found. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      const data: IUser = await response.json();
      setProfile(data);

      if ('wallet' in data && data.wallet) {
        setWallet(data.wallet as IWallet);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, fetchProfile]);

  const updateProfile = async (updateData: Partial<IUser>): Promise<boolean> => {
    if (!token) {
        setError("Authentication token not found.");
        return false;
    }
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data: ProfileUpdateResponse = await response.json();
      setProfile(data.user);
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
    if (!token) {
      setError("Authentication token not found.");
      return false;
    }
    setIsUpdating(true);
    setError(null);
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ section, data: sectionData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update ${section} section`);
      }

      const data: ProfileUpdateResponse = await response.json();
      setProfile(data.user);
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
    profile,
    wallet,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateSection,
    isUpdating,
  };
};
