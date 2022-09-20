import { TRPCError } from '@trpc/server';
import { isOwner } from '@web/server/trpc/middleware/auth';
import { t } from '@web/server/trpc/trpc-server-root';

import { createPropertyRequestSchema } from '@web/server/trpc/validation/property-schema';
import { CreatePropertyController } from '@web/server/trpc/router/controllers/create-property.controller';
import { z } from 'zod';

const protectedProcedure = t.procedure.use(isOwner);
export const ownerRouter = t.router({
    getAll: protectedProcedure.query(async ({ ctx, input }) => {
        return ctx.prisma.property.findMany({
            where: {
                userId: ctx.user.id
            }
        });
    }),
    searchCityByName: t.procedure
        .input(
            z.object({
                name: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            return ctx.prisma.city.findFirst({
                where: {
                    name: {
                        startsWith: input.name,
                        mode: 'insensitive'
                    }
                }
            });
        }),

    searchCommuneByName: t.procedure
        .input(
            z.object({
                name: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            return ctx.prisma.municipality.findMany({
                where: {
                    name: {
                        startsWith: input.name,
                        mode: 'insensitive'
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            });
        }),
    searchLocalityByName: t.procedure
        .input(
            z.object({
                name: z.string(),
                communeUid: z.string().uuid()
            })
        )
        .query(async ({ ctx, input }) => {
            return ctx.prisma.locality.findMany({
                where: {
                    name: {
                        contains: input.name,
                        mode: 'insensitive'
                    },
                    municipalityId: input.communeUid
                },
                orderBy: {
                    name: 'asc'
                }
            });
        })

    // create: protectedProcedure
    //     .input(createPropertyRequestSchema)
    //     .mutation(async ({ ctx, input }) => {
    //         const res = await CreatePropertyController.handle({
    //             ctx,
    //             input: {
    //                 ...input,
    //                 ownerId: ctx.user.id
    //             }
    //         });

    //         if (res.errors) {
    //             throw new TRPCError({
    //                 code: 'BAD_REQUEST',
    //                 cause: res.errors
    //             });
    //         }

    //         return { success: true };
    //     })
});
