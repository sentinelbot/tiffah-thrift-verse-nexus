
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if a user has any of the specified roles
 * @param userId The user ID to check
 * @param roles Array of roles to check for
 * @returns Promise<boolean> True if the user has any of the roles
 */
export const hasAnyRole = async (userId: string, roles: string[]): Promise<boolean> => {
  try {
    // Create a comma-separated list of roles for the query
    const rolesString = roles.map(role => `'${role}'`).join(',');
    
    const { data, error } = await supabase.rpc('has_any_role', {
      user_id: userId,
      role_array: roles
    });
    
    if (error) {
      console.error('Error checking roles:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Error in hasAnyRole:', error);
    return false;
  }
};

/**
 * Gets all roles for a user
 * @param userId The user ID
 * @returns Promise<string[]> Array of role names
 */
export const getUserRoles = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('get_user_roles', {
      body: { user_id: userId }
    });
    
    if (error) {
      console.error('Error getting user roles:', error);
      return [];
    }
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error in getUserRoles:', error);
    return [];
  }
};

/**
 * Gets permissions for a specific role
 * @param role The role name
 * @returns Promise<string[]> Array of permission names
 */
export const getRolePermissions = async (role: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('get_role_permissions', {
      body: { role_name: role }
    });
    
    if (error) {
      console.error('Error getting role permissions:', error);
      return [];
    }
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error in getRolePermissions:', error);
    return [];
  }
};

/**
 * Checks if a user has a specific permission
 * @param userId The user ID
 * @param permission The permission to check for
 * @returns Promise<boolean> True if the user has the permission
 */
export const hasPermission = async (userId: string, permission: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('has_permission', {
      body: { user_id: userId, permission_name: permission }
    });
    
    if (error) {
      console.error('Error checking permission:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in hasPermission:', error);
    return false;
  }
};

/**
 * Assigns a role to a user
 * @param userId The user ID
 * @param role The role to assign
 * @returns Promise<boolean> True if successful
 */
export const assignRoleToUser = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('assign_role_to_user', {
      body: { user_id: userId, role_name: role }
    });
    
    if (error) {
      console.error('Error assigning role:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in assignRoleToUser:', error);
    return false;
  }
};

/**
 * Removes a role from a user
 * @param userId The user ID
 * @param role The role to remove
 * @returns Promise<boolean> True if successful
 */
export const removeRoleFromUser = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('remove_role_from_user', {
      body: { user_id: userId, role_name: role }
    });
    
    if (error) {
      console.error('Error removing role:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in removeRoleFromUser:', error);
    return false;
  }
};

/**
 * Gets all available roles in the system
 * @returns Promise<string[]> Array of role names
 */
export const getAvailableRoles = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('role')
      .distinct();
    
    if (error) {
      console.error('Error getting available roles:', error);
      return [];
    }
    
    return data.map(row => row.role);
  } catch (error) {
    console.error('Error in getAvailableRoles:', error);
    return [];
  }
};
