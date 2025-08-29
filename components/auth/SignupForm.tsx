// app/components/auth/SignupForm.tsx
'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Car, Shield, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SignupCredentials } from '@/types/auth';
import { cn } from '@/lib/utils';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { signup, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<SignupCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'passenger',
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<SignupCredentials>>({});

  const roleOptions = [
    {
      value: 'passenger' as const,
      label: 'Passenger',
      description: 'Book rides and travel',
      icon: MapPin,
    },
    {
      value: 'driver' as const,
      label: 'Driver',
      description: 'Drive and earn money',
      icon: Car,
    },
    {
      value: 'owner' as const,
      label: 'Vehicle Owner',
      description: 'Own vehicles and manage fleet',
      icon: Shield,
    },
  ];

  const validateForm = (): boolean => {
    const errors: Partial<SignupCredentials> = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await signup(formData);
      onSuccess?.();
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleInputChange = (field: keyof SignupCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    if (error) {
      clearError();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
        <p className="text-gray-600 dark:text-gray-400">Join RideShareX and start your journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Global Error */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={cn(
                'block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                fieldErrors.name
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              )}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={cn(
                'block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                fieldErrors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              )}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
          )}
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            I want to join as
          </label>
          <div className="grid grid-cols-1 gap-3">
            {roleOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('role', option.value)}
                  className={cn(
                    'flex items-center p-4 border-2 rounded-lg transition-all duration-200',
                    formData.role === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  )}
                  disabled={isLoading}
                >
                  <IconComponent className={cn(
                    'w-6 h-6 mr-3',
                    formData.role === option.value
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  )} />
                  <div className="text-left">
                    <p className={cn(
                      'font-medium',
                      formData.role === option.value
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                    )}>
                      {option.label}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {option.description}
                    </p>
                  </div>
                  {formData.role === option.value && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={cn(
                'block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                fieldErrors.password
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              )}
              placeholder="Create a password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={cn(
                'block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                fieldErrors.confirmPassword
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              )}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          By creating an account, you agree to our{' '}
          <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
            Privacy Policy
          </a>
          .
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200',
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          )}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Create Account
            </>
          )}
        </button>

        {/* Switch to Login */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;