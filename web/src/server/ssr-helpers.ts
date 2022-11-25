import jwt from 'jsonwebtoken';
import { prisma } from '~/server/db/client';
import { Uuid } from '~/utils/uuid';
import { env } from '~/env/server.mjs';
import { appRouter } from './trpc/router';

import type { User } from '@prisma/client';

export async function getUser(sessionToken: string) {
    // get user from cookie
    let user: User | null = null;

    try {
        // Verify the token
        const decoded = jwt.verify(sessionToken, env.JWT_SECRET) as {
            id?: string;
        };

        if (decoded.id) {
            user = await prisma.user.findFirst({
                where: {
                    id: Uuid.fromShort(decoded.id).toString()
                }
            });
        }

        return user;
    } catch (error) {
        return null;
    }
}

// trpc object that can be called inside server components
export const rsc = (user?: User | null) =>
    appRouter.createCaller({
        prisma,
        user: user
    });
