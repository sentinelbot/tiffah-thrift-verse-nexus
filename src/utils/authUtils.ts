
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

/**
 * Check if the user has a specific role
 */
export const hasRole = async (userId: string, requiredRole: string): Promise<boolean> => {
  try {
    // First, check if the user's role in the profiles table matches the required role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    if (profile && profile.role === requiredRole) {
      return true;
    }
    
    // If not found in profile, check the user_roles table
    const { data: userRoles, error: rolesError } = await supabase
      .rpc('has_role', { required_role: requiredRole })
      .single();
    
    if (rolesError) throw rolesError;
    
    return userRoles || false;
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
};

/**
 * Check if the user has any of the specified roles
 */
export const hasAnyRole = async (userId: string, roles: string[]): Promise<boolean> => {
  try {
    // First, check the profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    if (profile && roles.includes(profile.role)) {
      return true;
    }
    
    // Then check for each role individually
    for (const role of roles) {
      const hasUserRole = await hasRole(userId, role);
      if (hasUserRole) return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking roles:', error);
    return false;
  }
};

/**
 * Get all roles for a user
 */
export const getUserRoles = async (userId: string): Promise<string[]> => {
  try {
    const roles: string[] = [];
    
    // Get role from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (!profileError && profile && profile.role) {
      roles.push(profile.role);
    }
    
    // Get custom function to retrieve roles
    const { data: customRoles, error: customRolesError } = await supabase
      .rpc('get_user_roles', { user_id: userId });
    
    if (!customRolesError && customRoles) {
      // If the function returns an array of roles
      customRoles.forEach((role: string) => {
        if (!roles.includes(role)) {
          roles.push(role);
        }
      });
    }
    
    return roles;
  } catch (error) {
    console.error('Error getting user roles:', error);
    return [];
  }
};

/**
 * Get permissions for a role
 */
export const getRolePermissions = async (role: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_role_permissions', { role_name: role });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error getting role permissions:', error);
    return [];
  }
};

/**
 * Check if the user has a specific permission
 */
export const hasPermission = async (userId: string, permissionName: string): Promise<boolean> => {
  try {
    // Use RPC function to check permission
    const { data, error } = await supabase
      .rpc('has_permission', { 
        user_id: userId,
        permission: permissionName 
      })
      .single();
    
    if (error) throw error;
    
    return data || false;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

/**
 * Assign a role to a user
 */
export const assignRoleToUser = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .rpc('assign_role_to_user', { 
        user_id: userId, 
        role_name: role 
      });
    
    return !error;
  } catch (error) {
    console.error('Error assigning role:', error);
    return false;
  }
};

/**
 * Remove a role from a user
 */
export const removeRoleFromUser = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .rpc('remove_role_from_user', { 
        user_id: userId, 
        role_name: role 
      });
    
    return !error;
  } catch (error) {
    console.error('Error removing role:', error);
    return false;
  }
};
