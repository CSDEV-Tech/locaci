import { createRouter } from './context';
import { z } from 'zod';
import { supabaseAdmin as supabase } from 'web/src/utils/supabase-admin';
import { TRPCError } from '@trpc/server';
import { Uuid } from '@locaci/domain';
import { getCookie } from 'web/src/lib/functions';

export const authRouter = createRouter()
    .mutation('send-email-link', {
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
    .mutation('set-auth-cookie', {
        input: z.object({
            uid: z.string().uuid()
        }),
        async resolve({ input: { uid }, ctx }) {
            ctx.res?.setHeader(
                'set-cookie',
                `user=${new Uuid(
                    uid
                ).short()}; path=/; samesite=strict; httponly;`
            );
            return { success: true };
        }
    })
    .mutation('remove-auth-cookie', {
        async resolve({ ctx }) {
            ctx.res?.setHeader(
                'set-cookie',
                `user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict; httponly;`
            );
            return { success: true };
        }
    })
    .query('getUser', {
        async resolve({ ctx }) {
            if (ctx.req?.headers.cookie) {
                const uid = getCookie('user', ctx.req?.headers.cookie);

                if (uid) {
                    const user = await ctx.prisma.user.findFirst({
                        where: {
                            id: Uuid.fromShort(uid).toString()
                        }
                    });

                    return user;
                }
            }

            throw new TRPCError({
                code: 'UNAUTHORIZED'
            });
        }
    })
    .mutation('getOrCreateUser', {
        input: z.object({
            email: z.string().email(),
            uid: z.string().uuid()
        }),
        async resolve({ ctx, input }) {
            let user = await ctx.prisma.user.findFirst({
                where: {
                    email: input.email
                }
            });

            if (!user) {
                user = await ctx.prisma.user.create({
                    data: {
                        id: input.uid,
                        email: input.email
                    }
                });
            }

            return user;
        }
    });
