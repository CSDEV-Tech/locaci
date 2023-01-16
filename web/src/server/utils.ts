import jwt from 'jsonwebtoken';
import { prisma } from '~/server/db/client';
import { Uuid } from '~/lib/uuid';
import { env } from '~/env/server.mjs';

import type { User } from '@prisma/client';

export async function getUserFromSessionToken(sessionToken: string) {
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

export function revalidatePath(paths: string | string[]) {
    const searchParams = new URLSearchParams();
    if (typeof paths === 'string') {
        searchParams.append('path', paths);
    } else {
        for (const path of paths) {
            searchParams.append('path', path);
        }
    }
    searchParams.append('nextSecret', env.NEXT_REVALIDATE_SECRET);
    return fetch(
        `${env.NEXT_PUBLIC_SITE_URL}/api/revalidate?${searchParams.toString()}`
    );
}
