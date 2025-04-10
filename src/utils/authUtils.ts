
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
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', requiredRole);
    
    if (rolesError) throw rolesError;
    
    return userRoles && userRoles.length > 0;
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
    
    // Then check user_roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .in('role', roles);
    
    if (rolesError) throw rolesError;
    
    return userRoles && userRoles.length > 0;
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
    
    // Get roles from user_roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (!rolesError && userRoles) {
      userRoles.forEach(row => {
        if (!roles.includes(row.role)) {
          roles.push(row.role);
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
      .from('role_permissions')
      .select(`
        permission_id,
        permissions (
          name
        )
      `)
      .eq('role', role);
    
    if (error) throw error;
    
    return data.map(item => item.permissions.name);
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
    // Get all user roles
    const userRoles = await getUserRoles(userId);
    
    // Check permissions for each role
    for (const role of userRoles) {
      const permissions = await getRolePermissions(role);
      if (permissions.includes(permissionName)) {
        return true;
      }
    }
    
    return false;
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
      .from('user_roles')
      .insert({ user_id: userId, role });
    
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
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);
    
    return !error;
  } catch (error) {
    console.error('Error removing role:', error);
    return false;
  }
};
