import { createRouter } from './context';
import { z } from 'zod';
import { supabaseAdmin as supabase } from 'web/src/utils/supabase-admin';
import { TRPCError } from '@trpc/server';
import { Uuid } from '@locaci/domain';
import { createProtectedRouter } from './protected-router';

import { Role } from '@prisma/client';

export const authRouter = createRouter()
    .mutation('sendEmailLink', {
        input: z.object({
            email: z.string().email(),
            redirectTo: z.string().url()
        }),
        async resolve({ input: { email, redirectTo } }) {
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
        }
    })
    .mutation('setAuthCookie', {
        input: z.object({
            uid: z.string().uuid()
        }),
        async resolve({ input: { uid }, ctx }) {
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
        }
    })
    .mutation('removeAuthCookie', {
        async resolve({ ctx }) {
            ctx.res?.setHeader(
                'set-cookie',
                `user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict; httponly;`
            );
            return { success: true };
        }
    })
    .mutation('getOrCreateUser', {
        input: z.object({
            email: z.string().email(),
            firstName: z.string().nullish(),
            lastName: z.string().nullish(),
            uid: z.string().uuid()
        }),
        async resolve({ ctx, input }) {
            const { data } = await supabase.auth.admin.getUserById(input.uid);

            if (!data.user) {
                throw new TRPCError({
                    message: 'This user is not registered',
                    code: 'BAD_REQUEST'
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
        }
    })
    .merge(
        // all roles
        createProtectedRouter([
            Role.ADMIN,
            Role.HOUSING_APPLICANT,
            Role.PROPERTY_OWNER
        ])
            .query('getUser', {
                async resolve({ ctx }) {
                    return ctx.user;
                }
            })
            .mutation('updateNameProfile', {
                input: z.object({
                    firstName: z.string().min(1),
                    lastName: z.string().min(1)
                }),
                async resolve({ ctx, input: { firstName, lastName } }) {
                    await ctx.prisma.user.update({
                        where: {
                            id: ctx.user.id
                        },
                        data: {
                            firstName,
                            lastName
                        }
                    });
                }
            })
    );
