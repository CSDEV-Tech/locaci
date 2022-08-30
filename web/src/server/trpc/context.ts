// src/server/router/context.ts
import * as trpc from '@trpc/server';
import { getCookie } from 'web/src/lib/functions';
import { prisma } from '../db/client';
import { Uuid } from '@locaci/domain';

import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { User } from '@prisma/client';

export const createContext = async (opts?: CreateNextContextOptions) => {
    const req = opts?.req;
    const res = opts?.res;

    // get user from cookie
    let user: User | null = null;
    if (req?.headers.cookie) {
        const uid = getCookie('user', req?.headers.cookie);

        if (uid) {
            user = await prisma.user.findFirst({
                where: {
                    id: Uuid.fromShort(uid).toString()
                }
            });
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
