// lib/auth.ts
import { User, LoginCredentials, SignupCredentials, AuthResponse } from '@/types/auth';

// Auth utility functions
export class AuthService {
  private static TOKEN_KEY = 'auth_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';
  private static USER_KEY = 'user_data';

  // Get token from localStorage
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Set token in localStorage
  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Remove token from localStorage
  static removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

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

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
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

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data: AuthResponse = await response.json();
      
      // Store auth data
      this.setToken(data.token);
      this.setUser(data.user);
      
      return data;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
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

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data: AuthResponse = await response.json();
      
      // Store auth data
      this.setToken(data.token);
      this.setUser(data.user);
      
      return data;
    } catch (error) {
      throw new Error('Signup failed. Please try again.');
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeToken();
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