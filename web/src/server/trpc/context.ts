// utils
import * as trpc from '@trpc/server';
import { getUser } from '~/utils/ssr-helpers';
import { getCookie } from '~/utils/functions';
import { prisma } from '~/server/db/client';
import { supabaseAdmin } from '~/utils/supabase-admin';

// types
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { User } from '@prisma/client';

export const createContext = async (opts?: CreateNextContextOptions) => {
    const req = opts?.req;
    const res = opts?.res;

    // get user from cookie
    let user: User | null = null;
    if (req?.headers.cookie) {
        const sessionToken = getCookie('__session', req?.headers.cookie);

        if (sessionToken) {
            user = await getUser(sessionToken);
        }
    }

    return {
        req,
        res,
        prisma,
        user,
        supabaseAdmin
    };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
