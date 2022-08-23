import { TRPCError } from '@trpc/server';
import { createRouter } from './context';

import type { Role } from '@prisma/client';

export function createProtectedRouter(roles: Role[]) {
    return createRouter().middleware(async ({ ctx, next }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }

        if (!roles.includes(ctx.user.role)) {
            throw new TRPCError({ code: 'FORBIDDEN' });
        }

        return next({
            ctx: {
                ...ctx,
                // infers that `user` is non-nullable to downstream procedures
                user: ctx.user
            }
        });
    });
}
