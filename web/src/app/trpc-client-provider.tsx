'use client';
import * as React from 'react';

// components
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// utils
import { QueryClient } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';
import { env } from '~/env/client.mjs';

// types
import type { AppRouter } from '~/server/trpc/router';

export const t = createTRPCReact<AppRouter>({});

function getBaseUrl() {
    // browser should use relative path
    if (typeof window !== 'undefined') return '';

    return env.NEXT_PUBLIC_SITE_URL; // should use env URL
}

export function TrpcClientProvider(props: { children: React.ReactNode }) {
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
    const [trpcClient] = React.useState(() =>
        t.createClient({
            links: [
                loggerLink({
                    enabled: opts =>
                        process.env.NODE_ENV === 'development' ||
                        (opts.direction === 'down' &&
                            opts.result instanceof Error)
                }),
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                    headers() {
                        return {
                            'cache-control':
                                'private, no-cache, no-store, max-age=0, must-revalidate'
                        };
                    }
                })
            ],
            transformer: superjson
        })
    );
    return (
        <t.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {props.children}
                <ReactQueryDevtools position="bottom-right" />
            </QueryClientProvider>
        </t.Provider>
    );
}
