// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nupmiordvcttudndzizm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cG1pb3JkdmN0dHVkbmR6aXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMjYwNzUsImV4cCI6MjA1OTgwMjA3NX0.xNqDxUzoo8lNCFIvziLwo225qdAbpSKElR134euP6v0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);