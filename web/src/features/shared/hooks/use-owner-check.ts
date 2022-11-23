import { useRouter } from 'next/router';
import { supabase } from '../../../utils/supabase-client';
import { t } from '../../../utils/trpc-rq-hooks';
import type { User } from '@prisma/client';

export function useOwnerCheck(): {
    user: User | undefined;
    isLoading: boolean;
    router: ReturnType<typeof useRouter>;
    logoutMutation: ReturnType<typeof t.auth.removeAuthCookie.useMutation>;
} {
    const router = useRouter();
    const utils = t.useContext();
    const {
        data: user,
        isLoading,
        isError
    } = t.auth.getAuthenticatedUser.useQuery();
    const logoutMutation = t.auth.removeAuthCookie.useMutation({
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
