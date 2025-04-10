
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'staff' | 'productManager' | 'orderPreparer' | 'deliveryStaff';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean; // Added for consistency with references
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<boolean>; // Alias for login
  signOut: () => void; // Alias for logout
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock different user roles for testing purposes
      let role: User['role'] = 'customer';
      
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('product')) {
        role = 'productManager';
      } else if (email.includes('order')) {
        role = 'orderPreparer';
      } else if (email.includes('delivery')) {
        role = 'deliveryStaff';
      } else if (email.includes('staff')) {
        role = 'staff';
      }
      
      // Mock user for demo purposes
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0],
        email: email,
        role: role
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would call an API to create a user
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: name,
        email: email,
        role: 'customer'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!user) return false;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isLoading: loading, // Alias for consistent naming
    login,
    logout,
    signIn: login, // Alias for consistent naming
    signOut: logout, // Alias for consistent naming
    signUp,
    updateProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
