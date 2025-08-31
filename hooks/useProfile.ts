
// hooks/useProfile.ts - Fixed version
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  UserProfile, 
  ProfileResponse, 
  ProfileUpdateResponse,
} from '@/types/profile';

interface UseProfileReturn {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateSection: (section: string, data: any) => Promise<boolean>;
  isUpdating: boolean;
}

export const useProfile = (): UseProfileReturn => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authData = useAuth();

  const getAuthToken = useCallback(() => {
    if (authData?.token) {
      return authData.token;
    }
    if (typeof window !== 'undefined') {
      // --- THIS IS THE FIX ---
      return localStorage.getItem('token'); // Corrected key to match auth hook
    }
    return null;
  }, [authData?.token]);

  const fetchProfile = useCallback(async (): Promise<void> => {
    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authentication token not found. Please log in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const data: UserProfile = await response.json();
      setUser(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  useEffect(() => {
    if (!authData.loading) {
      if (authData.token) {
        fetchProfile();
      } else {
        setLoading(false);
        setError("Please log in to view your profile.");
      }
    }
  }, [authData.loading, authData.token, fetchProfile]);

  const updateProfile = async (updateData: Partial<UserProfile>): Promise<boolean> => {
    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authentication required');
      return false;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
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
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateSection = async (section: string, sectionData: any): Promise<boolean> => {
    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authentication required');
      return false;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
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
      return true;
    } catch (err: any) {
      setError(err.message || `Failed to update ${section} section`);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    user,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateSection,
    isUpdating,
  };
};
