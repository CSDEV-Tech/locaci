import { createClient } from '@supabase/supabase-js';
import { env } from '../env/client.mjs';

const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_KEY
);

export { supabase };
