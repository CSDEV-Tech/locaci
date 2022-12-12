'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import superjson from 'superjson';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import type { AppRouter } from '~/server/trpc/router';

export const t = createTRPCReact<AppRouter>({});

function getBaseUrl() {
    // browser should use relative path
    if (typeof window !== 'undefined') return '';

    if (process.env.SITE_URL) return `https://${process.env.SITE_URL}`; // should use LOCACI's URL

    return `http://localhost:${process.env.PORT ?? 3000}`; // dev should use localhost
}

export function TrpcClientProvider(props: { children: React.ReactNode }) {
    const [queryClient] = useState(
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
    const [trpcClient] = useState(() =>
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
