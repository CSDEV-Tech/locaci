import jwt from 'jsonwebtoken';
import { prisma } from '~/server/db/client';
import { Uuid } from '~/utils/uuid';
import { env } from '~/env/server.mjs';
import { cache } from 'react';

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
    } catch (error) {
        // do nothing... that means that the user is not authenticated
    }

    return user;
}

export const getUserCached = cache(getUser);
