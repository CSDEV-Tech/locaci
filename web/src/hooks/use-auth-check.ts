import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase-client';
import { t } from '../utils/trpc-rq-hooks';

export function useAuthCheck() {
    const router = useRouter();
    const utils = t.proxy.useContext();
    const {
        data: user,
        isLoading,
        isError
    } = t.proxy.auth.getAuthenticatedUser.useQuery();
    const logoutMutation = t.proxy.auth.removeAuthCookie.useMutation({
        onSuccess: async () => {
            await supabase.auth.signOut();
            await utils.auth.getAuthenticatedUser.invalidate();
            await utils.auth.getUser.invalidate();
        }
    });

    if (isError) {
        router.replace('/login');
    }

    return {
        user,
        isLoading,
        logoutMutation,
        router
    };
}
