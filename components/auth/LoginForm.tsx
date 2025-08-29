// app/components/auth/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types/auth';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToSignup }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<LoginCredentials>>({});

  const validateForm = (): boolean => {
    const errors: Partial<LoginCredentials> = {};

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

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await login(formData);
      onSuccess?.();
    } catch (error) {
      // Error is handled by useAuth hook
      console.error('Login failed:', error);
    }
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear global error
    if (error) {
      clearError();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-gray-600 dark:text-gray-400">Sign in to your RideShareX account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Global Error */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

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
              placeholder="Enter your password"
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

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
          >
            Forgot your password?
          </button>
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
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </>
          )}
        </button>

        {/* Switch to Signup */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Sign up here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;