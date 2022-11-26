'use client';

import * as React from 'react';

// utils
import { env } from '~/env/client.mjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingScreen } from '~/features/shared/components/loading-screen';
import { NextLinkButton } from '~/features/shared/components/next-link';
import { ErrorScreen } from '~/features/shared/components/error-screen';
import { getRoleURL } from '~/utils/functions';

// types
import { t } from '~/utils/trpc-rq-hooks';

export default function CallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const verifyOAuthCodeMutation = t.auth.verifyOAuthCode.useMutation({
        onSuccess({ role }) {
            router.replace(getRoleURL(role));
        }
    });
    const code = searchParams.get('code');

    React.useEffect(() => {
        if (!code) {
            router.replace('/auth/login');
            return;
        }

        verifyOAuthCodeMutation.mutate({
            code,
            redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        });
    }, []);

    return (
        <>
            {verifyOAuthCodeMutation.isError ? (
                <ErrorScreen
                    className="h-screen"
                    errorDescription={`Une erreur est survenue lors de la connexion, veuillez vous reconnecter.`}>
                    <NextLinkButton href="/auth/login" variant="primary">
                        Connectez-vous
                    </NextLinkButton>
                </ErrorScreen>
            ) : (
                <LoadingScreen
                    title="Connexion à votre compte..."
                    className="h-screen w-full"
                />
            )}
        </>
    );
}
