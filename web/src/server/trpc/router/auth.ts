import { isLoggedIn } from './../middleware/auth';
import { z } from 'zod';
import { t } from '../trpc-server-root';
import { supabaseAdmin as supabase } from 'web/src/utils/supabase-admin';
import { TRPCError } from '@trpc/server';
import { Uuid } from '@locaci/domain';
import {
    updateNameAndProfileSchema,
    sendEmailLinkSchema,
    requestOwnerAccessSchema
} from '../validation/auth-schema';

const protectedProcedure = t.procedure.use(isLoggedIn);

export const authRouter = t.router({
    sendEmailLink: t.procedure
        .input(sendEmailLinkSchema)
        .mutation(async ({ input: { email, redirectTo } }) => {
            const { error } = await supabase.auth.signInWithOtp({
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

            ctx.res?.setHeader(
                'set-cookie',
                `user=${new Uuid(
                    uid
                ).short()}; path=/; samesite=strict; httponly; expires=${expirationDate.toUTCString()}`
            );
            return { success: true };
        }),
    removeAuthCookie: t.procedure.mutation(async ({ ctx }) => {
        ctx.res?.setHeader(
            'set-cookie',
            `user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict; httponly;`
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
            const { data } = await supabase.auth.admin.getUserById(input.uid);

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
        }),
    requestOwnerAccess: t.procedure
        .input(requestOwnerAccessSchema)
        .mutation(async ({ ctx, input }) => {
            // Update new user informations
            const user = await ctx.prisma.user.upsert({
                create: {
                    ...input,
                    email_verified: false
                },
                update: {
                    ...input,
                    email_verified: false
                },
                where: {
                    email: input.email
                }
            });

            // create the request if it does not exists, else do nothing
            await ctx.prisma.requestOwnerRole.upsert({
                create: {
                    userId: user.id
                },
                update: {},
                where: {
                    userId: user.id
                }
            });

            return { success: true };
        })
});
