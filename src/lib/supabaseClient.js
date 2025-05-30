import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || "https://your-project-id.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "your-anon-public-key";

export const supabase = createClient(supabaseUrl, supabaseKey);
