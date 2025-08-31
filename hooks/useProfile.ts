// hooks/useProfile.ts
import { useState, useEffect } from 'react';

interface Address {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface EmergencyContact {
  name: string;
  phone: string;
}

interface Wallet {
  totalBalance: number;
  addedBalance: number;
  generatedBalance: number;
}

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  profileImage?: string;
  role: 'passenger' | 'driver' | 'owner';
  address: {
    homeLocation?: Address;
    currentLocation?: Address;
  };
  emergencyContact?: EmergencyContact;
  wallet: Wallet;
  passengerInfo?: {
    approxRideDuration?: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  profileImage?: string;
  address?: {
    homeLocation?: Address;
    currentLocation?: Address;
  };
  emergencyContact?: EmergencyContact;
  passengerInfo?: {
    approxRideDuration?: number;
  };
}

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Get auth token from localStorage or cookies
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token') || 
             document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
    }
    return null;
  };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update profile data
  const updateProfile = async (updateData: UpdateProfileData) => {
    try {
      setUpdating(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.data);
      return { success: true, data: data.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  };

  // Upload profile image
  const uploadProfileImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = getAuthToken();
      const response = await fetch('/api/users/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Image upload failed');
      }

      const data = await response.json();
      
      // Update profile with new image URL
      if (profile) {
        setProfile({ ...profile, profileImage: data.imageUrl });
      }
      
      return { success: true, imageUrl: data.imageUrl };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Image upload failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Refresh profile data
  const refreshProfile = () => {
    fetchProfile();
  };

  // Check if user is specific role
  const isRole = (role: 'passenger' | 'driver' | 'owner') => {
    return profile?.role === role;
  };

  // Get wallet balance
  const getWalletBalance = () => {
    return profile?.wallet?.totalBalance || 0;
  };

  // Load profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    // Data
    profile,
    loading,
    error,
    updating,
    
    // Actions
    updateProfile,
    uploadProfileImage,
    refreshProfile,
    
    // Utilities
    isRole,
    getWalletBalance,
  };
};