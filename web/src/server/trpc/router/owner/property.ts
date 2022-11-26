import { updatePropertyStep1Schema } from '~/server/trpc/validation/property-schema';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { isOwner } from '~/server/trpc/middleware/auth';
import { t } from '~/server/trpc/trpc-server-root';

import type { RentType } from '@prisma/client';

const protectedProcedure = t.procedure.use(isOwner);
export const ownerRouter = t.router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.property.findMany({
            where: {
                userId: ctx.user.id
            },
            include: {
                commune: true,
                city: true,
                locality: true
            }
        });
    }),
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
    searchCityByName: protectedProcedure
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
    searchCommuneByName: protectedProcedure
        .input(
            z.object({
                name: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            return ctx.prisma.municipality.findMany({
                where: {
                    name: {
                        contains: input.name,
                        mode: 'insensitive'
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            });
        }),
    searchLocalityByName: protectedProcedure
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
        }),

    create: protectedProcedure.mutation(async ({ ctx, input }) => {
        const property = await ctx.prisma.property.create({
            data: {
                userId: ctx.user.id,
                rooms: {
                    createMany: {
                        data: [{ type: 'BEDROOM' }]
                    }
                }
            }
        });

        return { uuid: property.id };
    }),

    updatePropertyStep1: protectedProcedure
        .input(updatePropertyStep1Schema)
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.property.update({
                where: {
                    id: input.propertyUid
                },
                data: {
                    surfaceArea: input.surfaceArea,
                    rentType: input.rentType as RentType,
                    userId: ctx.user.id
                }
            });
        })
    // create: protectedProcedure
    //     .input(createPropertyRequestSchema)
    //     .mutation(async ({ ctx, input }) => {
    //         const res = await CreatePropertyController.handle({
    //             ctx,
    //             input: {
    //                 ...input
    //             }
    //         });

    //         if (res.error) {
    //             throw new TRPCError({
    //                 code: 'BAD_REQUEST',
    //                 message: res.error
    //             });
    //         }

    //         return res.property;
    //     })
});
