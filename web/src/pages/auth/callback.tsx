import * as React from 'react';
// components
import { LoadingIndicator } from '@locaci/ui';
import Head from 'next/head';

// functions & others
import { supabase } from '@web/utils/supabase-client';
import { t } from '@web/utils/trpc-rq-hooks';
import { useRouter } from 'next/router';

// types
import type { NextPageWithLayout } from '@web/pages/_app';

export const CallbackPage: NextPageWithLayout = () => {
    const router = useRouter();
    const setAuthCookieMutation = t.auth.setAuthCookie.useMutation({
        onSuccess() {
            router.push('/profile');
        }
    });
    const getUserMutation = t.auth.getOrCreateUser.useMutation({
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

        // if user is already connected, then redirect automatically to profile
        async function checkUserSession() {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) {
                getUserMutation.mutate({
                    email: data.session.user.email!,
                    uid: data.session.user.id
                });
            }
        }
        checkUserSession();

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
        <>
            <Head key={'document-head'}>
                <title>{`Connexion à votre compte... | LOCACI`}</title>
            </Head>

            <section className="flex h-screen w-screen items-center justify-center">
                <h1 className="flex items-center gap-4 text-4xl">
                    <LoadingIndicator className="h-10" />{' '}
                    <span>CHARGEMENT...</span>
                </h1>
            </section>
        </>
    );
};

export default CallbackPage;
