import * as React from 'react';
import { supabase } from 'web/src/utils/supabase-client';
import { t } from 'web/src/utils/trpc-rq-hooks';
import { useRouter } from 'next/router';
import { LoadingIndicator } from '@locaci/ui';

export default function CallbackPage() {
    const router = useRouter();
    const setAuthCookieMutation = t.proxy.auth.setAuthCookie.useMutation({
        onSuccess() {
            router.push('/profile');
        }
    });
    const getUserMutation = t.proxy.auth.getOrCreateUser.useMutation({
        onSuccess(data) {
            setAuthCookieMutation.mutate({
                uid: data.id
            });
        }
    });

    React.useEffect(() => {
        // if no token, redirect to login page
        const params = new URLSearchParams(window.location.hash.substring(1));
        if (!params.has('access_token')) {
            router.push('/login');
        }

        // Listen for supabase login event
        const {
            data: { subscription: authListener }
        } = supabase.auth.onAuthStateChange((_, session) => {
            if (session?.user) {
                getUserMutation.mutate({
                    email: session.user.email!,
                    uid: session.user.id
                });
            }
        });

        return () => {
            authListener?.unsubscribe();
        };
    }, []);

    return (
        <main className="flex h-screen w-screen items-center justify-center">
            <h1 className="flex items-center gap-4 text-4xl">
                <LoadingIndicator className="h-10" /> <span>CHARGEMENT...</span>
            </h1>
        </main>
    );
}
