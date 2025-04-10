
import { supabase } from './client';

/**
 * Generic adapter function to handle Supabase RPC calls
 * 
 * @param functionName - The name of the RPC function
 * @param params - Parameters to pass to the function
 * @returns A promise that resolves to the function result
 */
export async function callRpcFunction<T = any>(
  functionName: string, 
  params: Record<string, any> = {}
): Promise<T> {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      console.error(`Error calling ${functionName}:`, error);
      throw error;
    }
    
    return data as T;
  } catch (error) {
    console.error(`Exception in ${functionName}:`, error);
    throw error;
  }
}

/**
 * Wrapper functions for common RPC calls
 */

export const userRoles = {
  hasRole: (userId: string, role: string) => 
    callRpcFunction<boolean>('has_role', { p_user_id: userId, p_role: role }),
    
  getUserRoles: (userId: string) => 
    callRpcFunction<string[]>('get_user_roles', { p_user_id: userId }),
    
  addUserRole: (userId: string, role: string) => 
    callRpcFunction<boolean>('add_user_role', { p_user_id: userId, p_role: role }),
    
  removeUserRole: (userId: string, role: string) => 
    callRpcFunction<boolean>('remove_user_role', { p_user_id: userId, p_role: role })
};

export const staffManagement = {
  getDeliveryStaff: () => 
    callRpcFunction('get_delivery_staff'),
    
  getStaffPerformance: (staffId: string, startDate: string, endDate: string) => 
    callRpcFunction('get_staff_performance', { staff_id: staffId, start_date: startDate, end_date: endDate })
};

export const scanManagement = {
  processPendingScans: (userId: string) => 
    callRpcFunction<{ processed: number }>('process_pending_scans', { p_user_id: userId }),
    
  getUserScanHistory: (userId: string) => 
    callRpcFunction<any[]>('get_user_scan_history', { p_user_id: userId, p_limit: 50 })
};

export const analytics = {
  getSalesData: (startDate: string, endDate: string) => 
    callRpcFunction('get_sales_data', { start_date: startDate, end_date: endDate }),
    
  getSalesByCategory: (startDate: string, endDate: string) => 
    callRpcFunction('get_sales_by_category', { start_date: startDate, end_date: endDate }),
    
  getInventoryStatus: () => 
    callRpcFunction('get_inventory_status')
};
