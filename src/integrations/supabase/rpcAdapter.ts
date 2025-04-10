
import { supabase } from './client';
import { Json } from '@/types/product';

// Define allowed RPC function names for type safety
type RpcFunctionName = 
  | 'has_role' 
  | 'get_user_roles' 
  | 'add_user_role' 
  | 'remove_user_role' 
  | 'get_delivery_staff' 
  | 'process_pending_scans' 
  | 'get_user_scan_history'
  | 'get_scan_history';

/**
 * Generic function to call RPC functions with proper typing
 * @param functionName The name of the RPC function to call
 * @param params The parameters to pass to the function
 * @returns The result of the RPC call
 */
export const callRpcFunction = async <T>(
  functionName: RpcFunctionName,
  params?: any
): Promise<T | null> => {
  try {
    // Type assertion to make TypeScript happy
    const rpcFunction = functionName as any;
    
    const { data, error } = await supabase.rpc(rpcFunction, params);
    
    if (error) {
      console.error(`Error calling RPC function ${functionName}:`, error);
      return null;
    }
    
    return data as T;
  } catch (err) {
    console.error(`Exception when calling RPC function ${functionName}:`, err);
    return null;
  }
};
