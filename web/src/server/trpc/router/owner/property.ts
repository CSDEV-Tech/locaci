import { TRPCError } from '@trpc/server';
import { isOwner } from '@web/server/trpc/middleware/auth';
import { t } from '@web/server/trpc/trpc-server-root';

import { createPropertyRequestSchema } from '@web/server/trpc/validation/property-schema';
import { CreatePropertyController } from '@web/server/trpc/router/controllers/create-property.controller';

const protectedProcedure = t.procedure.use(isOwner);
export const ownerRouter = t.router({
    getAll: protectedProcedure.query(async ({ ctx, input }) => {
        return ctx.prisma.property.findMany({
            where: {
                userId: ctx.user.id
            }
        });
    }),
    create: protectedProcedure
        .input(createPropertyRequestSchema)
        .mutation(async ({ ctx, input }) => {
            const res = await CreatePropertyController.handle({
                ctx,
                input: {
                    ...input,
                    ownerId: ctx.user.id
                }
            });

            if (res.errors) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    cause: res.errors
                });
            }

            return { success: true };
        })
});
