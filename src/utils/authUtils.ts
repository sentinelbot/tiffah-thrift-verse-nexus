
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

/**
 * Checks if the current user has a specific role
 * @param role Role to check for
 * @returns Boolean indicating if user has the specified role
 */
export const hasRole = async (role: string): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return false;
    }

    const { data, error } = await supabase.rpc('has_role', { 
      required_role: role 
    });

    if (error) {
      console.error('Error checking role:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in hasRole:', error);
    return false;
  }
};

/**
 * Checks if the current user has any of the specified roles
 * @param roles Array of roles to check for
 * @returns Boolean indicating if user has any of the specified roles
 */
export const hasAnyRole = async (roles: string[]): Promise<boolean> => {
  try {
    for (const role of roles) {
      const hasUserRole = await hasRole(role);
      if (hasUserRole) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error in hasAnyRole:', error);
    return false;
  }
};

/**
 * Gets all roles for the current user
 * @returns Array of role names
 */
export const getUserRoles = async (): Promise<string[]> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id);

    if (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }

    return data.map(item => item.role);
  } catch (error) {
    console.error('Error in getUserRoles:', error);
    return [];
  }
};

/**
 * Add a role to the current user
 * @param role Role to add
 * @returns Boolean indicating success
 */
export const addRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert([{ user_id: userId, role }]);

    if (error) {
      console.error('Error adding role:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addRole:', error);
    return false;
  }
};

/**
 * Remove a role from the current user
 * @param role Role to remove
 * @returns Boolean indicating success
 */
export const removeRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (error) {
      console.error('Error removing role:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in removeRole:', error);
    return false;
  }
};

/**
 * Get all delivery staff users
 * @returns Array of delivery staff users
 */
export const getDeliveryStaff = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('user_id, profiles!inner(id, name, email)')
      .eq('role', 'deliveryStaff');

    if (error) {
      console.error('Error fetching delivery staff:', error);
      return [];
    }

    return data.map(item => ({
      id: item.profiles.id,
      name: item.profiles.name,
      email: item.profiles.email,
      role: 'deliveryStaff'
    }));
  } catch (error) {
    console.error('Error in getDeliveryStaff:', error);
    return [];
  }
};

/**
 * Complete scan synchronization
 */
export const completeScanSync = async (scans: any[]): Promise<{synced: number, failed: number}> => {
  let synced = 0;
  let failed = 0;

  try {
    // Process in batches for better performance
    const batchSize = 10;
    for (let i = 0; i < scans.length; i += batchSize) {
      const batch = scans.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('scan_history')
        .insert(batch);
      
      if (error) {
        console.error('Error syncing scans batch:', error);
        failed += batch.length;
      } else {
        synced += batch.length;
      }
    }
    
    return { synced, failed };
  } catch (error) {
    console.error('Error in completeScanSync:', error);
    return { synced, failed: scans.length - synced };
  }
};

/**
 * Get scan history for the current user
 */
export const getScanHistory = async (limit = 20): Promise<any[]> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return [];
    }

    const { data, error } = await supabase
      .from('scan_history')
      .select('*')
      .eq('scanned_by', userData.user.id)
      .order('scan_time', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching scan history:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error in getScanHistory:', error);
    return [];
  }
};
