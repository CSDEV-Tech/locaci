import { Uuid } from '@locaci/domain';
import { z } from 'zod';
import { t } from '../../trpc-server-root';
import { isAdmin } from '../../middleware/auth';
import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import { env } from '@web/env/server.mjs';
import { RequestStatus } from '@prisma/client';
import { refuseOwnerAccessSchema } from '../../validation/auth-schema';

const protectedProcedure = t.procedure.use(isAdmin);

export const adminRouter = t.router({
    getAllRequests: protectedProcedure.query(async ({ ctx, input }) => {
        return await ctx.prisma.requestOwnerRole.findMany({
            orderBy: {
                createdAt: `desc`
            },
            include: {
                user: true
            }
        });
    }),
    generateLinkForOwner: protectedProcedure
        .input(
            z.object({
                uid: z.string().uuid(),
                host: z.string().url()
            })
        )
        .mutation(async ({ ctx, input }) => {
            // create the request if it does not exists, else do nothing
            const request = await ctx.prisma.requestOwnerRole.findUnique({
                where: {
                    id: input.uid
                }
            });

            if (!request) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            const token = jwt.sign(
                {
                    id: new Uuid(request.id).short()
                },
                env.JWT_SECRET,
                {
                    expiresIn: `1d`, // only for one day
                    algorithm: 'HS256'
                }
            );

            return `${input.host}/auth/confirm-access?token=${token}`;
        }),
    refuseOwnerAccess: protectedProcedure
        .input(refuseOwnerAccessSchema)
        .mutation(async ({ ctx, input: { uid, reason } }) => {
            // pass state to granted because the user has validated now
            const request = await ctx.prisma.requestOwnerRole.update({
                where: {
                    id: uid.toString()
                },
                data: {
                    status: RequestStatus.REFUSED,
                    reasonForRefusing: reason
                }
            });

            // TODO : Send Email to owner with reason
            return { success: true };
        })
});
