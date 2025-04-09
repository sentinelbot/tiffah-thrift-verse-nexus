
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session and set user
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
        } else if (data?.session) {
          // Here we'd typically fetch the user profile from our database
          // This is a mock user for demonstration
          const mockUser: User = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: 'Demo User',
            role: 'admin', // For demo purposes, we set as admin
          };
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Unexpected error checking auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // Mock user data - in a real app, you'd fetch this from your database
          const mockUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: 'Demo User',
            role: 'admin', // For testing, we set as admin
          };
          setUser(mockUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in. Please check your credentials.');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name?: string, role?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
            role: role || 'customer',
          },
        },
      });

      if (error) {
        throw error;
      }

      toast.success('Registration successful! Please check your email to confirm your account.');
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to create account. Please try again.');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
      throw error;
    }
  };

  // Add updateProfile method to update user profile data
  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // In a real app, you would update the user profile in your database
      // For this demo, we'll just update the local state
      setUser({ ...user, ...data });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    isLoading,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
