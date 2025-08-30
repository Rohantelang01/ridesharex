// lib/auth.ts
import { User, LoginCredentials, SignupCredentials, AuthResponse } from '@/types/auth';

// Auth utility functions
export class AuthService {
  private static USER_KEY = 'user_data';

  // Get user data from localStorage
  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Set user data in localStorage
  static setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Remove user data from localStorage
  static removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.USER_KEY);
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getUser();
  }

  // Login API call
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      this.setUser(data.user);
      
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    }
  }

  // Signup API call
  static async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      this.setUser(data.user);
      
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed. Please try again.');
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeUser();
    }
  }

  // Get user initials for avatar
  static getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  // Generate avatar background color based on name
  static getAvatarColor(name: string): string {
    const colors = [
      'bg-gradient-to-r from-blue-500 to-purple-600',
      'bg-gradient-to-r from-green-500 to-blue-600',
      'bg-gradient-to-r from-purple-500 to-pink-600',
      'bg-gradient-to-r from-orange-500 to-red-600',
      'bg-gradient-to-r from-teal-500 to-cyan-600',
      'bg-gradient-to-r from-indigo-500 to-purple-600',
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }
}
