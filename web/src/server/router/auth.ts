import { createRouter } from './context';
import { z } from 'zod';
import { supabase } from 'web/src/utils/supabase-client';

export const authRouter = createRouter()
    .query('getUser', {
        async resolve({ ctx }) {
            console.log({
                headers: ctx.req.headers
            });

            const data = await supabase.auth.api.getUserByCookie(ctx.req);

            const user = await ctx.prisma.user.findFirst({
                where: {
                    email: data.user?.email
                }
            });

            return user;
        }
    })
    .mutation('getOrCreateUser', {
        input: z.object({
            email: z.string().email(),
            event: z.enum([
                'PASSWORD_RECOVERY',
                'SIGNED_IN',
                'SIGNED_OUT',
                'TOKEN_REFRESHED',
                'USER_UPDATED',
                'USER_DELETED'
            ]),
            session: z.any()
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
                        email: input.email
                    }
                });
            }

            return user;
        }
    });
