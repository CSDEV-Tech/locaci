import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase-client';

import type { Provider } from '@supabase/supabase-js';
import { getHostWithScheme } from '@/utils/functions';

export function useOAuthMutation() {
    return useMutation((provider: Provider) =>
        supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${getHostWithScheme(
                    window.location.href
                )}/auth/callback`
            }
        })
    );
}
