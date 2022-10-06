// src/server/router/context.ts
import * as trpc from '@trpc/server';
import jwt from 'jsonwebtoken';
import { Uuid } from '@/utils/uuid';
import { getCookie } from '@/utils/functions';
import { prisma } from '@/server/db/client';
import { env } from '@/env/server.mjs';

import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { User } from '@prisma/client';
import type { JwtPayload } from 'jsonwebtoken';
import { supabaseAdmin } from '@/utils/supabase-admin';

export const createContext = async (opts?: CreateNextContextOptions) => {
    const req = opts?.req;
    const res = opts?.res;

    // get user from cookie
    let user: User | null = null;
    if (req?.headers.cookie) {
        const sessionToken = getCookie('__session', req?.headers.cookie);

        if (sessionToken) {
            try {
                // Verify the token
                const decoded = jwt.verify(
                    sessionToken,
                    env.JWT_SECRET
                ) as JwtPayload;

                if (decoded.id) {
                    user = await prisma.user.findFirst({
                        where: {
                            id: Uuid.fromShort(decoded.id).toString()
                        }
                    });
                }
            } catch (error) {
                // do nothing... that means that the user is not authenticated
            }
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
