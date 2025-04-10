
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/types/product';

/**
 * Check if the current user has a specific role
 */
export const checkUserHasRole = async (role: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('has_role', {
      required_role: role
    });
    
    if (error) {
      console.error('Error checking user role:', error);
      return false;
    }
    
    return Boolean(data);
  } catch (error) {
    console.error('Error in checkUserHasRole:', error);
    return false;
  }
};

/**
 * Get all roles for a user (defaults to current user if no ID provided)
 */
export const getUserRoles = async (userId?: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.rpc('get_user_roles', {
      user_id: userId
    });
    
    if (error) {
      console.error('Error getting user roles:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserRoles:', error);
    return [];
  }
};

/**
 * Add a role to a user
 */
export const addUserRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('add_user_role', {
      p_user_id: userId,
      p_role: role
    });
    
    if (error) {
      console.error('Error adding user role:', error);
      return false;
    }
    
    return Boolean(data);
  } catch (error) {
    console.error('Error in addUserRole:', error);
    return false;
  }
};

/**
 * Remove a role from a user
 */
export const removeUserRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('remove_user_role', {
      p_user_id: userId,
      p_role: role
    });
    
    if (error) {
      console.error('Error removing user role:', error);
      return false;
    }
    
    return Boolean(data);
  } catch (error) {
    console.error('Error in removeUserRole:', error);
    return false;
  }
};

/**
 * Get all users with delivery staff role
 */
export const getDeliveryStaff = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase.rpc('get_delivery_staff');
    
    if (error) {
      console.error('Error getting delivery staff:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getDeliveryStaff:', error);
    return [];
  }
};

/**
 * Get scan history for a user
 */
export const getUserScanHistory = async (userId: string, limit = 20): Promise<any[]> => {
  try {
    const { data, error } = await supabase.rpc('get_user_scan_history', {
      p_user_id: userId,
      p_limit: limit
    });
    
    if (error) {
      console.error('Error getting scan history:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserScanHistory:', error);
    return [];
  }
};

/**
 * Process pending scans that were captured offline
 */
export const processPendingScans = async (scans: any[]): Promise<any> => {
  try {
    const { data, error } = await supabase.rpc('process_pending_scans', {
      scans_json: scans as Json
    });
    
    if (error) {
      console.error('Error processing pending scans:', error);
      return { processed: 0, failed: scans.length };
    }
    
    return data || { processed: 0, failed: 0 };
  } catch (error) {
    console.error('Error in processPendingScans:', error);
    return { processed: 0, failed: scans.length };
  }
};
