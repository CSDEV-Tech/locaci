import { t } from '../trpc-server-root';
import { TRPCError } from '@trpc/server';
import { Role } from '@prisma/client';

export const isLoggedIn = t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next({
        ctx: {
            ...ctx,
            user: ctx.user
        }
    });
});

export const isAdmin = t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    if (ctx.user.role !== Role.ADMIN) {
        throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return next({
        ctx: {
            ...ctx,
            user: ctx.user
        }
    });
});

export const isOwner = t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    if (ctx.user.role !== Role.PROPERTY_OWNER) {
        throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return next({
        ctx: {
            ...ctx,
            user: ctx.user
        }
    });
});

export const isApplicant = t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    if (ctx.user.role !== Role.HOUSING_APPLICANT) {
        throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return next({
        ctx: {
            ...ctx,
            user: ctx.user
        }
    });
});
