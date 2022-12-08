import { TRPCError } from '@trpc/server';
import {
    updatePropertyStep1Schema,
    updatePropertyStep2Schema,
    updatePropertyStep4Schema,
    updatePropertyStep5Schema,
    updatePropertyStep6Schema,
    updatePropertyStep7Schema,
    updatePropertyStep8Schema
} from '~/validation/property-schema';
import { z } from 'zod';
import { t } from '~/server/trpc/trpc-server-root';
import { isOwner } from '~/server/trpc/middleware/auth';
import { Prisma } from '@prisma/client';

const protectedProcedure = t.procedure.use(isOwner);
export const ownerPropertiesRouter = t.router({
    getSingle: protectedProcedure
        .input(
            z.object({
                uid: z.string().uuid()
            })
        )
        .query(async ({ ctx, input }) => {
            const property = await ctx.prisma.property.findFirst({
                where: {
                    userId: ctx.user.id,
                    id: input.uid
                },
                include: {
                    rooms: true
                }
            });

            return property;
        }),
    deleteProperty: protectedProcedure
        .input(
            z.object({
                uid: z.string().uuid()
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.property.delete({
                    where: {
                        id: input.uid
                    }
                });
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === 'P2025'
                ) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message:
                            "Le logement que vous essayez de supprimer n'existe pas."
                    });
                } else {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: (error as Error).message
                    });
                }
            }
        })
});
