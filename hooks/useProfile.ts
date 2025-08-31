// hooks/useProfile.ts - Debug version to identify auth issue
'use client';

import { useState, useEffect } from 'react';
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
  uploadImage: (file: File, field: string) => Promise<string | null>;
  isUpdating: boolean;
  lastUpdated: Date | null;
}

export const useProfile = (): UseProfileReturn => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Get auth data from useAuth hook
  const authData = useAuth();

  // Debug: Log auth data to see what's available
  useEffect(() => {
    console.log('🔍 Auth Debug Data:', {
      authData,
      keys: Object.keys(authData || {}),
      user: authData?.user,
      isAuthenticated: authData?.isAuthenticated,
      token: authData?.token
    });
  }, [authData]);

  // Comprehensive token retrieval function
  const getAuthToken = () => {
    // Debug: Log all possible token sources
    console.log('🔍 Token Sources Debug:', {
      fromUseAuth: authData?.token,
      localStorage: {
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
        authToken: typeof window !== 'undefined' ? localStorage.getItem('authToken') : null,
        jwt: typeof window !== 'undefined' ? localStorage.getItem('jwt') : null,
        accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
      },
      sessionStorage: {
        token: typeof window !== 'undefined' ? sessionStorage.getItem('token') : null,
        authToken: typeof window !== 'undefined' ? sessionStorage.getItem('authToken') : null,
      },
      cookies: typeof window !== 'undefined' ? document.cookie : null
    });

    // Try to get token from useAuth first
    if (authData?.token) {
      console.log('✅ Token found from useAuth');
      return authData.token;
    }

    // Fallback to browser storage
    if (typeof window !== 'undefined') {
      const possibleTokens = [
        localStorage.getItem('token'),
        localStorage.getItem('authToken'),
        localStorage.getItem('jwt'),
        localStorage.getItem('accessToken'),
        sessionStorage.getItem('token'),
        sessionStorage.getItem('authToken'),
        sessionStorage.getItem('jwt'),
      ];

      for (const token of possibleTokens) {
        if (token) {
          console.log('✅ Token found from storage:', token.substring(0, 20) + '...');
          return token;
        }
      }

      // Check cookies
      const cookies = document.cookie.split('; ');
      for (const cookie of cookies) {
        if (cookie.startsWith('token=') || cookie.startsWith('authToken=')) {
          const token = cookie.split('=')[1];
          if (token) {
            console.log('✅ Token found from cookies');
            return token;
          }
        }
      }
    }

    console.log('❌ No token found anywhere');
    return null;
  };

  // Fetch user profile
  const fetchProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Fetching profile...');
      
      const authToken = getAuthToken();
      if (!authToken) {
        // Instead of throwing error, set a more user-friendly message
        setError('Please log in to view your profile');
        setLoading(false);
        return;
      }

      console.log('📡 Making API request with token...');

      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('❌ API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const data: ProfileResponse = await response.json();
      console.log('✅ Profile data received:', data);
      setUser(data.user);
      
    } catch (err: any) {
      console.error('❌ Profile fetch error:', err);
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  // Update entire profile
  const updateProfile = async (updateData: Partial<UserProfile>): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);

      const authToken = getAuthToken();
      if (!authToken) {
        setError('Authentication required');
        return false;
      }

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
      setLastUpdated(new Date());
      
      return true;
      
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      console.error('Profile update error:', err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Update specific section
  const updateSection = async (section: string, sectionData: any): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);

      const authToken = getAuthToken();
      if (!authToken) {
        setError('Authentication required');
        return false;
      }

      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          data: sectionData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update ${section} section`);
      }

      const data: ProfileUpdateResponse = await response.json();
      setUser(data.user);
      setLastUpdated(new Date());
      
      return true;
      
    } catch (err: any) {
      setError(err.message || `Failed to update ${section} section`);
      console.error(`${section} section update error:`, err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Upload image to Cloudinary
  const uploadImage = async (file: File, field: string): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ridesharex');
      formData.append('folder', 'profile-images');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.secure_url;
      
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
      console.error('Image upload error:', err);
      return null;
    }
  };

  // Load profile only if we can get a token
  useEffect(() => {
    // Small delay to ensure auth is initialized
    const timer = setTimeout(() => {
      console.log('⏰ Attempting to fetch profile...');
      fetchProfile();
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Remove dependencies to avoid infinite loops

  return {
    user,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateSection,
    uploadImage,
    isUpdating,
    lastUpdated,
  };
};