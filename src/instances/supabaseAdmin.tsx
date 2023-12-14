import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error('Missing env variable "NEXT_PUBLIC_SUPABASE_URL"');
if (!serviceRoleKey) throw new Error('Missing env variable "SERVICE_ROLE_KEY"');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export { supabaseUrl, serviceRoleKey };

export default supabase;
