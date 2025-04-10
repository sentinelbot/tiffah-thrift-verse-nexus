
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://nupmiordvcttudndzizm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cG1pb3JkdmN0dHVkbmR6aXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMjYwNzUsImV4cCI6MjA1OTgwMjA3NX0.xNqDxUzoo8lNCFIvziLwo225qdAbpSKElR134euP6v0',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: window.localStorage
    }
  }
);
