
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user authentication for development
    const checkAuth = async () => {
      // In a real app, we would check session with Supabase
      try {
        // Mock authenticated user for development
        const mockUser: User = {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin'
        };
        
        // Simulate auth delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setUser(mockUser);
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock sign in for development
      // In a real app, we would use Supabase auth.signIn
      
      let mockUser: User;
      
      if (email.includes('admin')) {
        mockUser = {
          id: '1',
          email: email,
          name: 'Admin User',
          role: 'admin'
        };
      } else if (email.includes('product')) {
        mockUser = {
          id: '2',
          email: email,
          name: 'Product Manager',
          role: 'productManager'
        };
      } else if (email.includes('order')) {
        mockUser = {
          id: '3',
          email: email,
          name: 'Order Preparer',
          role: 'orderPreparer'
        };
      } else if (email.includes('delivery')) {
        mockUser = {
          id: '4',
          email: email,
          name: 'Delivery Staff',
          role: 'deliveryStaff'
        };
      } else {
        mockUser = {
          id: '5',
          email: email,
          name: 'Customer',
          role: 'customer'
        };
      }
      
      setUser(mockUser);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Mock sign out for development
      // In a real app, we would use Supabase auth.signOut
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Mock sign up for development
      // In a real app, we would use Supabase auth.signUp
      
      const mockUser: User = {
        id: '6',
        email: email,
        name: name,
        role: 'customer'
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      // Mock profile update for development
      // In a real app, we would use Supabase to update the profile
      
      setUser({
        ...user,
        ...data
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    signUp,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
