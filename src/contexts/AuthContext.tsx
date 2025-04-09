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
  refreshUserData: () => Promise<void>;
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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return null;
      }
      
      return profileData;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session) {
          try {
            setTimeout(async () => {
              const profileData = await fetchUserProfile(session.user.id);
                
              if (profileData) {
                console.log('Profile data fetched:', profileData);
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: profileData.name || session.user.user_metadata?.name || 'User',
                  role: profileData.role || session.user.user_metadata?.role || 'customer',
                });
              } else {
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: session.user.user_metadata?.name || 'User',
                  role: session.user.user_metadata?.role || 'customer',
                });
              }
              setIsLoading(false);
            }, 0);
          } catch (profileError) {
            console.error('Error in profile fetch on auth change:', profileError);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || 'User',
              role: session.user.user_metadata?.role || 'customer',
            });
            setIsLoading(false);
          }
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setIsLoading(false);
        } else if (data?.session) {
          console.log('Found existing session:', data.session.user.id);
          setTimeout(async () => {
            try {
              const profileData = await fetchUserProfile(data.session.user.id);
                
              if (profileData) {
                console.log('Profile data loaded:', profileData);
                setUser({
                  id: data.session.user.id,
                  email: data.session.user.email || '',
                  name: profileData.name || data.session.user.user_metadata?.name || 'User',
                  role: profileData.role || data.session.user.user_metadata?.role || 'customer',
                });
              } else {
                setUser({
                  id: data.session.user.id,
                  email: data.session.user.email || '',
                  name: data.session.user.user_metadata?.name || 'User',
                  role: data.session.user.user_metadata?.role || 'customer',
                });
              }
            } catch (profileError) {
              console.error('Error in profile fetch:', profileError);
              setUser({
                id: data.session.user.id,
                email: data.session.user.email || '',
                name: data.session.user.user_metadata?.name || 'User',
                role: data.session.user.user_metadata?.role || 'customer',
              });
            }
            setIsLoading(false);
          }, 0);
        } else {
          console.log('No session found');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error checking auth:', error);
        setUser(null);
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign-in error:', error.message);
        throw error;
      }
      
      console.log('Sign-in successful');
    } catch (error: any) {
      console.error('Error signing in:', error);
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
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setUser({ ...user, ...data });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const refreshUserData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const profileData = await fetchUserProfile(user.id);
      
      if (profileData) {
        setUser({
          ...user,
          name: profileData.name || user.name,
          role: profileData.role || user.role,
        });
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    isLoading,
    updateProfile,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
