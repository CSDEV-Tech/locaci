import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';
import { loggerLink } from '@trpc/client/links/loggerLink';
import superjson from 'superjson';

import type { AppRouter } from '../server/trpc/router';

export type TRPCHooksType = ReturnType<typeof createTRPCNext<AppRouter>>;

function getBaseUrl() {
    // browser should use relative path
    if (typeof window !== 'undefined') return '';

    if (process.env.SITE_URL) return `https://${process.env.SITE_URL}`; // SSR should use LOCACI's URL

    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export const t: TRPCHooksType = createTRPCNext<AppRouter>({
    config({ ctx }) {
        return {
            transformer: superjson,
            links: [
                loggerLink({
                    enabled: opts =>
                        process.env.NODE_ENV === 'development' ||
                        (opts.direction === 'down' &&
                            opts.result instanceof Error)
                }),
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`
                })
            ],
            /**
             * @link https://react-query.tanstack.com/reference/QueryClient
             */
            queryClientConfig: {
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: 2, // retry twice by default
                        staleTime: 60 * 60 * 1_000 // 1 hour
                    }
                }
            },
            headers: () => {
                // on ssr, forward client's headers to the server
                return {
                    cookie: ctx?.req?.headers.cookie
                };
            }
        };
    },
    ssr: false
});
