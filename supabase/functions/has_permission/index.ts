
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

serve(async (req) => {
  try {
    const { user_id, permission } = await req.json()
    
    // Create a Supabase client with the Auth context of the user that called the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    
    // Get the user's roles
    const { data: userRolesData, error: userRolesError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user_id)
    
    if (userRolesError) throw userRolesError
    
    const userRoles = userRolesData.map(item => item.role)
    
    // Get the user's profile role as well
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user_id)
      .single()
    
    if (!profileError && profileData && profileData.role) {
      userRoles.push(profileData.role)
    }
    
    // Check if any of the user's roles have the permission
    for (const role of userRoles) {
      const { data, error } = await supabaseClient
        .from('role_permissions')
        .select(`
          permissions (name)
        `)
        .eq('role', role)
        .eq('permissions.name', permission)
      
      if (error) throw error
      
      if (data && data.length > 0) {
        return new Response(JSON.stringify(true), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        })
      }
    }
    
    return new Response(JSON.stringify(false), {
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
