// utils
import { getUser } from '~/server/ssr-helpers';
import { getCookie } from '~/utils/functions';
import { prisma } from '~/server/db/client';

// types
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

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
        user
    };
};

export type Context = {
    req?: NextApiRequest;
    res?: NextApiResponse;
    user?: User | null;
    prisma: typeof prisma;
};
