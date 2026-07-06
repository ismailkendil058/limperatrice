import { createClient } from '@supabase/supabase-js';

// Supabase project URL and anon public key (provided by the user)
const SUPABASE_URL = 'https://fjxkmajxudqbqeyssmlj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqeGttYWp4dWRxYnFleXNzbWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMDU4OTUsImV4cCI6MjA5ODc4MTg5NX0.6bvhmWP46KDOFrMA2dFX5ecP4_2BgyGbRZ88QJ-DLP0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
