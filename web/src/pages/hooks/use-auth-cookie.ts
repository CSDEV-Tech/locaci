import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { jsonFetch } from 'web/src/lib/functions';

export function useAuthCookieMutation() {
    const router = useRouter();
    return useMutation(
        'set-auth-cookie',
        async ({
            event,
            session
        }: {
            event: AuthChangeEvent;
            session: Session | null;
        }) => {
            return jsonFetch('/api/set-auth-cookie', {
                method: 'POST',
                body: JSON.stringify({
                    event,
                    session
                })
            });
        },
        {
            onSuccess(data, { event }, context) {
                if (event === 'SIGNED_IN') {
                    router.push('/profile');
                } else {
                    router.push('/');
                }
            },
            onError(error, variables, context) {}
        }
    );
}
