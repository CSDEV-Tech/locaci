import * as React from 'react';
import type { NextPage } from 'next';
import { supabase } from 'web/src/utils/supabase-client';
import { trpc } from 'web/src/utils/trpc';
import { useRouter } from 'next/router';

/**
 *
 * 1- Auth (provider)
 * 2- callback (tokens)
 *   - get user from supabase
 *
 *  useEffect:
 *   - if user is null :
 *      - redirect('home', => 'Non connecté')
 *   - if user is not null :
 *      - getOrCreateUser -> save user in cookie
 *      - redirect to profile page
 *
 */
export default function () {
    const router = useRouter();

    const authCookieMutation = trpc.useMutation('auth.setAuthCookie', {
        onSuccess() {
            router.push('/profile');
        }
    });
    const userMutation = trpc.useMutation('auth.getOrCreateUser', {
        onSuccess(data) {
            authCookieMutation.mutate({
                uid: data.id
            });
        }
    });

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.hash.substring(1));

        // if no token, redirect to login
        if (!params.has('access_token')) {
            router.push('/login');
        }

        const {
            data: { subscription: authListener }
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                userMutation.mutate({
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
        <main className="bg-dark h-screen w-screen">
            <h1 className="text-white">LOADING...</h1>
        </main>
    );
}
