import { z } from 'zod';
import { t } from '../../trpc-server-root';
import { TRPCError } from '@trpc/server';
import { Uuid } from '~/utils/uuid';
import {
    updateNameAndProfileSchema,
    sendEmailLinkSchema
} from '../../validation/auth-schema';
import jwt from 'jsonwebtoken';

import { ownerRouter } from './owner';
import { isLoggedIn } from '../../middleware/auth';
import { env } from '~/env/server.mjs';

const protectedProcedure = t.procedure.use(isLoggedIn);

export const authRouter = t.router({
    owner: ownerRouter,
    // base routes
    sendEmailLink: t.procedure
        .input(sendEmailLinkSchema)
        .mutation(async ({ ctx, input: { email, redirectTo } }) => {
            const { error } = await ctx.supabaseAdmin.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: redirectTo,
                    shouldCreateUser: true
                }
            });

            if (error !== null) {
                throw new TRPCError({
                    message: error.message,
                    code: 'BAD_REQUEST',
                    cause: error.cause
                });
            }

            return { success: true };
        }),
    // TODO : TO REMOVE
    setDefaultCookie: t.procedure.mutation(async ({ input, ctx }) => {
        // Stay connected for 30 days
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        const user = await ctx.prisma.user.findFirst({
            where: {
                role: 'PROPERTY_OWNER'
            }
        });

        const token = jwt.sign(
            {
                id: new Uuid(user!.id).short()
            },
            env.JWT_SECRET,
            {
                expiresIn: `30d`, // 30 days
                algorithm: 'HS256'
            }
        );

        ctx.res?.setHeader(
            'set-cookie',
            `__session=${token}; path=/; samesite=strict; httponly; expires=${expirationDate.toUTCString()}`
        );
        return { success: true };
    }),
    // END TODO : TO REMOVE

    setAuthCookie: t.procedure
        .input(
            z.object({
                uid: z.string().uuid()
            })
        )
        .mutation(async ({ input: { uid }, ctx }) => {
            // Stay connected for 30 days
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);

            const token = jwt.sign(
                {
                    id: new Uuid(uid).short()
                },
                env.JWT_SECRET,
                {
                    expiresIn: `30d`, // 30 days
                    algorithm: 'HS256'
                }
            );

            ctx.res?.setHeader(
                'set-cookie',
                `__session=${token}; path=/; samesite=strict; httponly; expires=${expirationDate.toUTCString()}`
            );
            return { success: true };
        }),
    removeAuthCookie: t.procedure.mutation(async ({ ctx }) => {
        ctx.res?.setHeader(
            'set-cookie',
            `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict; httponly;`
        );
        return { success: true };
    }),
    getOrCreateUser: t.procedure
        .input(
            z.object({
                email: z.string().email(),
                firstName: z.string().nullish(),
                lastName: z.string().nullish(),
                uid: z.string().uuid()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { data } = await ctx.supabaseAdmin.auth.admin.getUserById(
                input.uid
            );

            if (!data.user) {
                throw new TRPCError({
                    message: 'This user does not exist',
                    code: 'NOT_FOUND'
                });
            }

            return await ctx.prisma.user.upsert({
                where: {
                    email: input.email
                },
                create: {
                    id: input.uid,
                    email: input.email,
                    email_verified: true,
                    lastName: input.lastName,
                    firstName: input.firstName
                },
                update: {}
            });
        }),
    getAuthenticatedUser: protectedProcedure.query(({ ctx }) => {
        return ctx.user;
    }),
    getUser: t.procedure.query(({ ctx }) => {
        return ctx.user;
    }),
    updateNameProfile: protectedProcedure
        .input(updateNameAndProfileSchema)
        .mutation(async ({ ctx, input: { firstName, lastName } }) => {
            await ctx.prisma.user.update({
                where: {
                    id: ctx.user.id
                },
                data: {
                    firstName,
                    lastName
                }
            });

            return { success: true };
        })
});
