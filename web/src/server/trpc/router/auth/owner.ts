import { z } from 'zod';
import { t } from '../../trpc-server-root';
import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import { env } from 'web/src/env/server.mjs';
import { Uuid } from '@locaci/domain';
import { RequestStatus, Role } from '@prisma/client';
import { requestOwnerAccessSchema } from '../../validation/auth-schema';

import type { JwtPayload } from 'jsonwebtoken';

export const ownerRouter = t.router({
    confirmAccess: t.procedure
        .input(
            z.object({
                token: z.string().min(1)
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                // Verify the token
                const decoded = jwt.verify(
                    input.token,
                    env.JWT_SECRET
                ) as JwtPayload;

                const uid = Uuid.fromShort(decoded.id);

                // Only users which exists and that we didn't refuse the access
                const request = await ctx.prisma.requestOwnerRole.findFirst({
                    where: {
                        id: uid.toString(),
                        status: RequestStatus.WAITING
                    }
                });

                // Throw error to say that the link is invalid
                if (request === null) throw new Error();

                // update state to granted because the user has validated now
                await ctx.prisma.requestOwnerRole.update({
                    where: {
                        id: uid.toString()
                    },
                    data: {
                        status: RequestStatus.GRANTED,
                        validatedAt: new Date()
                    }
                });

                // give user new role
                await ctx.prisma.user.update({
                    where: {
                        id: request.userId
                    },
                    data: {
                        role: Role.PROPERTY_OWNER,
                        email_verified: true
                    }
                });

                return { uid: request.userId };
            } catch (error) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: `Ce lien n'est pas valide. Si vous avez fait une demande de création de compte, veuillez en refaire une.`
                });
            }
        }),
    requestAccess: t.procedure
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
