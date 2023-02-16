// utils
import { getUserFromSessionToken } from '~/server/utils';
import { prisma } from '~/server/db/client';
import { TypeSenseSearch } from '../typesense-search';
import { env } from '~/env/server.mjs';

// types
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import type { User } from '@prisma/client';
import type * as trpc from '@trpc/server';
import { cookies } from 'next/headers';

export const createContext = async (
    opts:
        | {
              type: 'rsc';
              getUser: () => Promise<User | null>;
          }
        | (FetchCreateContextFnOptions & { type: 'api' })
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

    const { type: _, ..._opts } = opts;

    // get user from cookie
    let user: User | null = null;
    const sessionToken = cookies().get(`__session`)?.value;
    if (sessionToken) {
        user = await getUserFromSessionToken(sessionToken);
    }

    return {
        ...opts,
        prisma,
        user,
        typesense: searchClient
    };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
