'use client';
import * as React from 'react';
// components
import { ErrorScreen } from '~/features/shared/components/error-screen';
import { NextLinkButton } from '~/features/shared/components/next-link';

// utils
import { Poppins } from '@next/font/google';

// types
import type { ErrorBoundaryProps } from '~/types';

const poppins = Poppins({
    subsets: ['latin'],
    variable: '--font-poppins',
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap'
});

export default function Error(props: ErrorBoundaryProps) {
    React.useEffect(() => {
        console.log(props.error);
    }, []);
    return (
        <html lang="fr" className={poppins.className}>
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="charset" content="utf-8" />
                <title>Erreur Survenue !</title>
            </head>
            <body>
                <ErrorScreen
                    errorDescription={props.error.message}
                    errorTitle={`OOPS ! Une erreur est survenue`}
                    className={`h-screen w-screen`}>
                    <NextLinkButton href={`/`} variant="primary">
                        Retourner à l'accueil
                    </NextLinkButton>
                </ErrorScreen>
            </body>
        </html>
    );
}
