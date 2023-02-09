// utils
import { getUserFromSessionToken } from '~/server/utils';
import { getCookie } from '~/lib/functions';
import { prisma } from '~/server/db/client';
import { TypeSenseSearch } from '../typesense-search';
import { env } from '~/env/server.mjs';

// types
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { User } from '@prisma/client';
import type * as trpc from '@trpc/server';

export const createContext = async (
    opts:
        | {
              type: 'rsc';
              getUser: () => Promise<User | null>;
          }
        | (CreateNextContextOptions & { type: 'api' })
) => {
    const searchClient = new TypeSenseSearch(
        env.TYPESENSE_SEARCH_API_KEY,
        env.TYPESENSE_SEARCH_URL
    );

    if (opts.type === 'rsc') {
        // RSC
        return {
            type: opts.type,
            prisma,
            user: await opts.getUser(),
            typesense: searchClient
        };
    }

    const req = opts?.req;
    const res = opts?.res;

    // get user from cookie
    let user: User | null = null;
    if (req?.headers.cookie) {
        const sessionToken = getCookie('__session', req?.headers.cookie);

        if (sessionToken) {
            user = await getUserFromSessionToken(sessionToken);
        }
    }

    return {
        req,
        res,
        prisma,
        user,
        typesense: searchClient
    };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
