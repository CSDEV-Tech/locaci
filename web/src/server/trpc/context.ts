// utils
import { getUserFromSessionToken } from '~/server/utils';
import { getCookie } from '~/utils/functions';
import { prisma } from '~/server/db/client';

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
    if (opts.type === 'rsc') {
        // RSC
        return {
            type: opts.type,
            prisma,
            user: await opts.getUser()
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
        user
    };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
