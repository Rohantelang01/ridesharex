
// hooks/useAuth.tsx
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { LoginData, SignupData, AuthContextType, User } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

// useAuth.tsx mein useEffect modify karo
useEffect(() => {
  // localStorage ki jagah cookies se read karo
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include' // Important for cookies
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setToken('authenticated'); // Just a flag
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
    setLoading(false);
  };
  
  checkAuthStatus();
}, []);
// useAuth.tsx mein login function ko bhi update karo
const login = async (data: LoginData) => {
  try {
    setError(null);
    setLoading(true);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ✅ Add this for cookies
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }
    
    // ✅ Remove localStorage lines, use only response data
    setUser(result.user);
    setToken('authenticated');
    
    console.log("Login successful, user:", result.user);
    router.push('/profile');

  } catch (err: any) {
    setError(err.message || 'An unknown error occurred');
  } finally {
    setLoading(false);
  }
};

  const signup = async (data: SignupData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Signup failed');
      }

      if (result.token && result.user) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setToken(result.token);
        setUser(result.user);
        console.log("Signup successful, user:", result.user);
        router.push('/profile');
      } else {
        throw new Error('Token or user data not found in signup response');
      }

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout');
    } catch (err) { 
      console.error("Logout failed", err); 
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, signup, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
