import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Fetch user profile data
  const user = await getUserProfile(data.user.id);
  return user;
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  name?: string,
  role: string = 'customer'
): Promise<User> => {
  // Sign up the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('User creation failed');
  }

  // Create profile record
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    name: name || '',
    role,
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  return {
    id: data.user.id,
    email: data.user.email || '',
    name: name || '',
    role,
  };
};

// Sign out
export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  
  if (!data.user) {
    return null;
  }

  try {
    // Get user profile data
    const user = await getUserProfile(data.user.id);
    return user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Get user profile by ID
export const getUserProfile = async (userId: string): Promise<User> => {
  // Fetch profile data
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    // Handle error when profile doesn't exist
    if (error.code === 'PGRST116') {
      // If profile doesn't exist, get basic info from auth
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        throw new Error('User not found');
      }
      
      // Create default profile
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: authData.user.user_metadata?.name || '',
          role: 'customer', // Default role
        })
        .select('*')
        .single();
        
      if (insertError) {
        throw new Error(insertError.message);
      }
      
      return {
        id: newProfile.id,
        name: newProfile.name,
        email: authData.user.email || '',
        role: newProfile.role,
      };
    }
    
    throw new Error(error.message);
  }

  // Get user email from auth
  const { data: authData } = await supabase.auth.getUser();
  
  return {
    id: data.id,
    name: data.name,
    email: authData.user?.email || '',
    role: data.role,
  };
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  profileData: Partial<User>
): Promise<User> => {
  const { error } = await supabase
    .from('profiles')
    .update({
      name: profileData.name,
      // Only update role if it's provided and user is authorized (would typically be restricted by RLS)
      ...(profileData.role ? { role: profileData.role } : {}),
    })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }

  // Get updated profile
  return getUserProfile(userId);
};

// Check if user has specific role
export const hasRole = async (userId: string, role: string): Promise<boolean> => {
  const user = await getUserProfile(userId);
  return user.role === role;
};

// Check if a user has a specific permission
export const hasPermission = async (
  userId: string,
  permission: string
): Promise<boolean> => {
  // First get the user's role
  const user = await getUserProfile(userId);

  // Then check if this role has the required permission
  const { data, error } = await supabase
    .from('role_permissions')
    .select('permission_id, permissions(name)')
    .eq('role', user.role)
    .eq('permissions.name', permission);

  if (error) {
    console.error('Permission check error:', error);
    return false;
  }

  return data.length > 0;
};

// For testing/mocking permissions during development
export const mockPermissionCheck = (
  userRole: string,
  permission: string
): boolean => {
  // Simple permission mapping for development
  const rolePermissions: Record<string, string[]> = {
    admin: ['all'],
    productManager: ['product:read', 'product:write', 'product:delete'],
    orderPreparer: ['order:read', 'order:process'],
    deliveryStaff: ['delivery:read', 'delivery:update'],
    customer: ['profile:read', 'profile:update', 'order:create'],
  };

  const permissions = rolePermissions[userRole] || [];
  
  // Admin has all permissions
  if (permissions.includes('all')) {
    return true;
  }
  
  return permissions.includes(permission);
};

// Get scan history
export const getScanHistory = async (limit: number = 50): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_history')
      .select('*')
      .order('scan_time', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching scan history:', error);
    return [];
  }
};
