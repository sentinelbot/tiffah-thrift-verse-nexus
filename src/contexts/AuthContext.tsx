
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
          // In production, fetch the user profile from our database
          try {
            // Fetch the user's profile from our database
            // Use a type assertion to resolve the TypeScript error
            const { data: profileData, error: profileError } = await (supabase
              .from('profiles') as any)
              .select('*')
              .eq('id', data.session.user.id)
              .single();
              
            if (profileError) {
              console.error('Error fetching user profile:', profileError);
              // Fall back to basic user data from auth
              setUser({
                id: data.session.user.id,
                email: data.session.user.email || '',
                name: data.session.user.user_metadata?.name || 'User',
                role: data.session.user.user_metadata?.role || 'customer',
              });
            } else if (profileData) {
              // Set user with data from our profile table
              // Use a type assertion to tell TypeScript we know the shape
              const profile = profileData as any;
              setUser({
                id: data.session.user.id,
                email: data.session.user.email || '',
                name: profile.name || data.session.user.user_metadata?.name || 'User',
                role: profile.role || data.session.user.user_metadata?.role || 'customer',
              });
            }
          } catch (profileError) {
            console.error('Error in profile fetch:', profileError);
            // Fall back to basic user data
            setUser({
              id: data.session.user.id,
              email: data.session.user.email || '',
              name: data.session.user.user_metadata?.name || 'User',
              role: data.session.user.user_metadata?.role || 'customer',
            });
          }
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
          try {
            // Fetch the user's profile from our database when auth state changes
            // Use a type assertion to resolve the TypeScript error
            const { data: profileData, error: profileError } = await (supabase
              .from('profiles') as any)
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profileError) {
              console.error('Error fetching user profile on auth change:', profileError);
              // Fall back to basic user data from auth
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || 'User',
                role: session.user.user_metadata?.role || 'customer',
              });
            } else if (profileData) {
              // Set user with data from our profile table
              // Use a type assertion to tell TypeScript we know the shape
              const profile = profileData as any;
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: profile.name || session.user.user_metadata?.name || 'User',
                role: profile.role || session.user.user_metadata?.role || 'customer',
              });
            }
          } catch (profileError) {
            console.error('Error in profile fetch on auth change:', profileError);
            // Fall back to basic user data
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || 'User',
              role: session.user.user_metadata?.role || 'customer',
            });
          }
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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

      // Use type assertion to tell TypeScript we know what we're doing
      const { error } = await (supabase
        .from('profiles') as any)
        .update({
          name: data.name,
          // Add other fields you want to update
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setUser({ ...user, ...data });
      toast.success('Profile updated successfully');
    } catch (error: any) {
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
