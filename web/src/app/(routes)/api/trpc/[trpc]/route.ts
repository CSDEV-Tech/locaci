import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '~/server/trpc/router';
import { createContext } from '~/server/trpc/context';
import { env } from '~/env/server.mjs';

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext(opts) {
            return createContext({
                type: 'api',
                ...opts
            });
        },
        onError:
            env.NODE_ENV === 'development'
                ? ({ path, error }) => {
                      console.error(
                          `❌ tRPC failed on ${path ?? '<no-path>'}: ${
                              error.message
                          }`
                      );
                  }
                : undefined
    });

export const GET = handler;
export const POST = handler;
