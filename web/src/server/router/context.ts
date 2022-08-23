// src/server/router/context.ts
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getCookie } from 'web/src/lib/functions';
import { prisma } from '../db/client';
import { Uuid } from '@locaci/domain';

import type { User } from '@prisma/client';

export const createContext = async (
    opts?: trpcNext.CreateNextContextOptions
) => {
    const req = opts?.req;
    const res = opts?.res;

    // get user from cookie
    const uid = getCookie('user', req?.headers.cookie);
    let user: User | null = null;

    if (uid) {
        user = await prisma.user.findFirst({
            where: {
                id: Uuid.fromShort(uid).toString()
            }
        });
    }

    return {
        req,
        res,
        prisma,
        user
    };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
