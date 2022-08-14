import * as React from 'react';
import type { NextPage } from 'next';
import { supabase } from 'web/src/utils/supabase-client';
import { trpc } from 'web/src/utils/trpc';
import { useAuthCookieMutation } from '../hooks/use-auth-cookie';
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

const Home: NextPage = () => {
    const router = useRouter();
    const authCookieMutation = useAuthCookieMutation();
    const userMutation = trpc.useMutation('auth.getOrCreateUser', {
        onSuccess(data, { event, session }) {
            authCookieMutation.mutate({
                session: session,
                event
            });
        }
    });

    React.useEffect(() => {
        const hash = window.location.hash.trim();

        if (!hash) {
            router.push('/');
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session?.user) {
                    userMutation.mutate({
                        email: session.user.email!,
                        event,
                        session
                    });
                }
            }
        );

        return () => {
            authListener?.unsubscribe();
        };
    }, []);

    return (
        <main className="bg-dark h-screen w-screen">
            <h1 className="text-white">LOADING...</h1>
        </main>
    );
};

export default Home;
