import * as React from 'react';
// components
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// utils
import { QueryClient } from '@tanstack/react-query';
import { json } from '@remix-run/node';
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration
} from '@remix-run/react';
import { env } from '~/www/lib/env.server';
import { getMetaTags } from '~/www/lib/meta';

import styles from '~/www/tailwind.css';

// types
import type { MetaFunction, LinksFunction } from '@remix-run/node';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const meta: MetaFunction<typeof loader> = ({ data }) =>
    getMetaTags({
        baseURL: data.PUBLIC_SITE_URL
    });

export async function loader() {
    return json({
        PUBLIC_SITE_URL: env.PUBLIC_SITE_URL,
        isProd: env.NODE_ENV === 'production'
    });
}

export default function Root() {
    const [queryClient] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: 2, // retry twice by default
                        staleTime: 60 * 60 * 1_000 // 1 hour
                    }
                }
            })
    );
    return (
        <html lang="fr" suppressHydrationWarning>
            <head>
                <Meta />
                <Links />
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"></link>
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""></link>
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body suppressHydrationWarning>
                <QueryClientProvider client={queryClient}>
                    <Outlet />
                    <ReactQueryDevtools position="bottom-right" />
                </QueryClientProvider>

                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
