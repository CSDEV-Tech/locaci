import { TRPCError } from '@trpc/server';
import {
    updatePropertyStep1Schema,
    updatePropertyStep2Schema,
    updatePropertyStep3Schema,
    updatePropertyStep4Schema,
    updatePropertyStep5Schema,
    updatePropertyStep6Schema
} from '~/validation/property-schema';
import { z } from 'zod';
import { t } from '~/server/trpc/trpc-server-root';
import { isOwner } from '~/server/trpc/middleware/auth';

import { Amenity, AmenityType, PropertyFormStep } from '@prisma/client';

const protectedProcedure = t.procedure.use(isOwner);
export const ownerPropertiesRouter = t.router({
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

        const drafts = await ctx.prisma.draftProperty.findMany({
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
            return ctx.prisma.draftProperty.findFirst({
                where: {
                    userId: ctx.user.id,
                    id: input.uid
                }
            });
        }),

    newDraft: protectedProcedure.mutation(async ({ ctx }) => {
        const property = await ctx.prisma.draftProperty.create({
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
            const draft = await ctx.prisma.draftProperty.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id
                }
            });

            if (!draft) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "L'annonce que vous essayez de modifier n'existe pas"
                });
            }

            return ctx.prisma.draftProperty.update({
                where: {
                    id: input.uid
                },
                data: {
                    surfaceArea: input.surfaceArea,
                    rentType: input.rentType,
                    currentStep:
                        draft.currentStep === PropertyFormStep.RENT_TYPE
                            ? 'ADDRESS'
                            : draft.currentStep
                }
            });
        }),
    saveDraftStep2: protectedProcedure
        .input(updatePropertyStep2Schema)
        .mutation(async ({ ctx, input }) => {
            const draft = await ctx.prisma.draftProperty.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id
                }
            });

            if (!draft) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "L'annonce que vous essayez de modifier n'existe pas"
                });
            }

            const locality = await ctx.prisma.locality.findUnique({
                where: {
                    id: input.localityUid
                },
                include: {
                    municipality: {
                        include: {
                            city: true
                        }
                    }
                }
            });

            if (!locality) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: "Le quartier que vous avez indiqué n'existe pas."
                });
            }

            return ctx.prisma.draftProperty.update({
                where: {
                    id: input.uid
                },
                data: {
                    localityName: locality.name,
                    municipalityName: locality.municipality.name,
                    cityName: locality.municipality.city.name,
                    localityId: input.localityUid,
                    cityId: input.cityUid,
                    municipalityId: input.municipalityUid,
                    longitude: input.longitude,
                    latitude: input.latitude,
                    geoData: input.geoJSON,
                    currentStep:
                        draft.currentStep === PropertyFormStep.ADDRESS
                            ? 'INSTRUCTIONS'
                            : draft.currentStep
                }
            });
        }),
    saveDraftStep3: protectedProcedure
        .input(updatePropertyStep3Schema)
        .mutation(async ({ ctx, input }) => {
            const draft = await ctx.prisma.draftProperty.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id
                }
            });

            if (!draft) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "L'annonce que vous essayez de modifier n'existe pas"
                });
            }

            return ctx.prisma.draftProperty.update({
                where: {
                    id: input.uid
                },
                data: {
                    addressInstructions: input.addressInstructions,
                    currentStep:
                        draft.currentStep === PropertyFormStep.INSTRUCTIONS
                            ? 'ROOMS'
                            : draft.currentStep
                }
            });
        }),
    saveDraftStep4: protectedProcedure
        .input(updatePropertyStep4Schema)
        .mutation(async ({ ctx, input }) => {
            const draft = await ctx.prisma.draftProperty.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id
                }
            });

            if (!draft) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "L'annonce que vous essayez de modifier n'existe pas"
                });
            }
            return ctx.prisma.draftProperty.update({
                where: {
                    id: input.uid
                },
                data: {
                    rooms: input.additionalRooms,
                    currentStep:
                        draft.currentStep === PropertyFormStep.ROOMS
                            ? draft.rentType === 'SHORT_TERM'
                                ? 'AMENITIES'
                                : 'IMAGES'
                            : draft.currentStep
                }
            });
        }),
    saveDraftStep5: protectedProcedure
        .input(updatePropertyStep5Schema)
        .mutation(async ({ ctx, input }) => {
            const draft = await ctx.prisma.draftProperty.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id
                }
            });

            if (!draft) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "L'annonce que vous essayez de modifier n'existe pas"
                });
            }

            const amenities: Array<Pick<Amenity, 'name' | 'type'>> = [];

            if (draft.rentType === 'SHORT_TERM') {
                for (const amenity of input.amenities) {
                    if (isCustomAmenity(amenity)) {
                        amenities.push({
                            name: amenity.name,
                            type: 'OTHER'
                        });
                    } else {
                        amenities.push({
                            name: null,
                            type: amenity.type
                        });
                    }
                }
            }

            return ctx.prisma.draftProperty.update({
                where: {
                    id: input.uid
                },
                data: {
                    amenities: amenities,
                    currentStep:
                        draft.currentStep === PropertyFormStep.AMENITIES
                            ? 'IMAGES'
                            : draft.currentStep
                }
            });
        }),
    saveDraftStep6: protectedProcedure
        .input(updatePropertyStep6Schema)
        .mutation(async ({ ctx, input }) => {
            const draft = await ctx.prisma.draftProperty.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id
                }
            });

            if (!draft) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "L'annonce que vous essayez de modifier n'existe pas"
                });
            }

            return ctx.prisma.draftProperty.update({
                where: {
                    id: input.uid
                },
                data: {
                    images: input.images,
                    currentStep:
                        draft.currentStep === PropertyFormStep.IMAGES
                            ? 'LISTING_DETAILS'
                            : draft.currentStep
                }
            });
        })
});

export function isCustomAmenity(
    amenity:
        | {
              type: AmenityType;
          }
        | {
              name: string;
          }
): amenity is { name: string } {
    return amenity.hasOwnProperty('name');
}
