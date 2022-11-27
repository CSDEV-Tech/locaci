import { TRPCError } from '@trpc/server';
import { updatePropertyStep1Schema } from '~/server/trpc/validation/property-schema';
import { z } from 'zod';
import { isOwner } from '~/server/trpc/middleware/auth';
import { t } from '~/server/trpc/trpc-server-root';

import type { RentType } from '@prisma/client';
import { PropertyFormStep } from '@prisma/client';

const protectedProcedure = t.procedure.use(isOwner);
export const ownerRouter = t.router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const properties = await ctx.prisma.property.findMany({
            where: {
                userId: ctx.user.id,
                archived: false
            },
            include: {
                municipality: true,
                city: true,
                locality: true
            }
        });

        const drafts = await ctx.prisma.propertyFormDto.findMany({
            where: {
                userId: ctx.user.id
            }
        });

        return { properties, drafts };
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
    getSingleDraft: protectedProcedure
        .input(
            z.object({
                uid: z.string().uuid()
            })
        )
        .query(async ({ ctx, input }) => {
            return ctx.prisma.propertyFormDto.findFirst({
                where: {
                    userId: ctx.user.id,
                    id: input.uid
                }
            });
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

    newDraft: protectedProcedure.mutation(async ({ ctx }) => {
        const property = await ctx.prisma.propertyFormDto.create({
            data: {
                userId: ctx.user.id,
                rooms: [{ type: 'BEDROOM' }]
            }
        });
        return { uuid: property.id };
    }),
    saveDraftStep1: protectedProcedure
        .input(updatePropertyStep1Schema)
        .mutation(async ({ ctx, input }) => {
            const draft = await ctx.prisma.propertyFormDto.findUnique({
                where: {
                    id: input.uid
                }
            });

            if (!draft) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "L'annonce que vous essayez de modifier n'existe pas"
                });
            }

            return ctx.prisma.propertyFormDto.update({
                where: {
                    id: input.uid
                },
                data: {
                    surfaceArea: input.surfaceArea,
                    rentType: input.rentType as RentType,
                    userId: ctx.user.id,
                    currentStep:
                        draft.currentStep === PropertyFormStep.RENT_TYPE
                            ? 'ADDRESS'
                            : draft.currentStep
                }
            });
        })
});
