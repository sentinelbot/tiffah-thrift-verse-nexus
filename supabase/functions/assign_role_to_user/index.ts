
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

serve(async (req) => {
  try {
    const { user_id, role_name } = await req.json()
    
    // Create a Supabase client with the Auth context of the user that called the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    
    // Check if the role assignment already exists
    const { data: existingRole, error: checkError } = await supabaseClient
      .from('user_roles')
      .select('*')
      .eq('user_id', user_id)
      .eq('role', role_name)
      .maybeSingle()
    
    if (checkError) throw checkError
    
    // If role is already assigned, return success
    if (existingRole) {
      return new Response(JSON.stringify({ success: true, message: 'Role already assigned' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    }
    
    // Insert the new role
    const { error } = await supabaseClient
      .from('user_roles')
      .insert({ user_id, role: role_name })
    
    if (error) throw error
    
    return new Response(JSON.stringify({ success: true }), {
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
