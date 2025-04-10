
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

serve(async (req) => {
  try {
    const { user_id, permission_name } = await req.json()
    
    // Create a Supabase client with the Auth context of the user that called the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    
    // Get the user's roles
    const { data: userRoles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user_id)
    
    if (rolesError) throw rolesError
    if (!userRoles || userRoles.length === 0) return new Response(JSON.stringify(false), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
    
    // Get the permission ID
    const { data: permission, error: permissionError } = await supabaseClient
      .from('permissions')
      .select('id')
      .eq('name', permission_name)
      .single()
    
    if (permissionError) throw permissionError
    if (!permission) return new Response(JSON.stringify(false), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
    
    // Check if any of the user's roles have the permission
    const roleNames = userRoles.map(r => r.role)
    const { data: rolePermissions, error: rpError } = await supabaseClient
      .from('role_permissions')
      .select('role')
      .eq('permission_id', permission.id)
      .in('role', roleNames)
    
    if (rpError) throw rpError
    
    // Return true if the user has the permission through any of their roles
    return new Response(JSON.stringify(rolePermissions && rolePermissions.length > 0), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
