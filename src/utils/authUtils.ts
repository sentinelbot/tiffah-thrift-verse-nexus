
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

/**
 * Checks if a user has a specific role
 * @param userId - The user's ID
 * @param role - The role to check for
 * @returns Promise<boolean> - Whether the user has the role
 */
export const hasRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('has_role', { user_id: userId, role_name: role });
    
    if (error) {
      console.error('Error checking user role:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Error in hasRole function:', error);
    return false;
  }
};

/**
 * Gets all roles for a user
 * @param userId - The user's ID
 * @returns Promise<string[]> - Array of role names
 */
export const getUserRoles = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_roles', { user_id: userId });
    
    if (error) {
      console.error('Error getting user roles:', error);
      return [];
    }
    
    // If there are no roles, data might be null or undefined
    if (!data) {
      return [];
    }
    
    // Ensure we're working with an array of strings
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error in getUserRoles function:', error);
    return [];
  }
};

/**
 * Adds a role to a user
 * @param userId - The user's ID
 * @param role - The role to add
 * @returns Promise<boolean> - Whether the operation was successful
 */
export const addUserRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('add_user_role', { user_id: userId, role_name: role });
    
    if (error) {
      console.error('Error adding user role:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addUserRole function:', error);
    return false;
  }
};

/**
 * Removes a role from a user
 * @param userId - The user's ID
 * @param role - The role to remove
 * @returns Promise<boolean> - Whether the operation was successful
 */
export const removeUserRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('remove_user_role', { user_id: userId, role_name: role });
    
    if (error) {
      console.error('Error removing user role:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeUserRole function:', error);
    return false;
  }
};

/**
 * Gets all delivery staff
 * @returns Promise<User[]> - Array of delivery staff
 */
export const getDeliveryStaff = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_delivery_staff');
    
    if (error) {
      console.error('Error getting delivery staff:', error);
      return [];
    }
    
    // Ensure we have a valid array of users
    return Array.isArray(data) ? data.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name || user.email.split('@')[0],
      role: 'deliveryStaff'
    })) : [];
  } catch (error) {
    console.error('Error in getDeliveryStaff function:', error);
    return [];
  }
};

/**
 * Process all pending barcode scans
 * @param userId - The user's ID
 * @returns Promise<{ processed: number }> - Number of processed scans
 */
export const processPendingScans = async (userId: string): Promise<{ processed: number }> => {
  try {
    const { data, error } = await supabase
      .rpc('process_pending_scans', { user_id: userId });
    
    if (error) {
      console.error('Error processing pending scans:', error);
      return { processed: 0 };
    }
    
    // Return the number of processed scans
    return { processed: data?.processed || 0 };
  } catch (error) {
    console.error('Error in processPendingScans function:', error);
    return { processed: 0 };
  }
};

/**
 * Gets scan history for a user
 * @param userId - The user's ID
 * @returns Promise<any[]> - Array of scan history items
 */
export const getUserScanHistory = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_scan_history', { user_id: userId });
    
    if (error) {
      console.error('Error getting user scan history:', error);
      return [];
    }
    
    // Ensure we have a valid array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error in getUserScanHistory function:', error);
    return [];
  }
};
