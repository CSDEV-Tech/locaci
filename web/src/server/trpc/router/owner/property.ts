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
import { type Amenity, Prisma, RoomType, Room } from '@prisma/client';

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
                    id: input.uid,
                    archived: false
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
                await ctx.prisma.property.update({
                    where: {
                        id: input.uid
                    },
                    data: {
                        archived: true
                    }
                });

                // Deactivate the listings for the property
                await ctx.prisma.listing.updateMany({
                    where: {
                        propertyId: input.uid
                    },
                    data: {
                        active: false
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
        }),

    duplicate: protectedProcedure
        .input(
            z.object({
                uid: z.string().uuid()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const property = await ctx.prisma.property.findFirst({
                where: {
                    userId: ctx.user.id,
                    id: input.uid
                },
                include: {
                    rooms: true,
                    amenities: true,
                    listings: true
                }
            });

            if (!property) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "Le logement que vous essayez de dupliquer n'existe pas"
                });
            }

            /**
             * Create Property based on the previous one
             **/
            // base object for creating a property
            const propertyCreated = {
                archived: false,
                noOfRooms: property.noOfRooms,
                userId: ctx.user.id,
                surfaceArea: property.surfaceArea,
                rentType: property.rentType,
                addressInstructions: property.addressInstructions,
                latitude: property.latitude,
                longitude: property.longitude,
                geoData: property.geoData,
                locality_osm_id: property.locality_osm_id,
                localityName: property.localityName,
                cityId: property.cityId,
                municipalityId: property.municipalityId,
                images: property.images,
                locality_bbox: property.locality_bbox
            };

            /**
             * ADD Amenities to the property
             * This is only possible if the property is a short term property
             */
            const amenities =
                property.rentType === 'SHORT_TERM' ? property.amenities : [];

            /**
             * Create the property in the DB
             */
            const newProperty = await ctx.prisma.property.create({
                data: {
                    ...propertyCreated,
                    images: propertyCreated.images as any[],
                    geoData: propertyCreated.geoData as any[],
                    locality_bbox: propertyCreated.locality_bbox as any[],
                    rooms: {
                        createMany: {
                            data: property.rooms.map(room => ({}))
                        }
                    },
                    amenities: {
                        createMany: {
                            data: amenities.map(am => ({
                                name: am.name,
                                type: am.type
                            }))
                        }
                    }
                }
            });

            // Create a listing
            await ctx.prisma.listing.create({
                data: {
                    propertyId: newProperty.id,
                    agencyMonthsPaymentAdvance:
                        property.listings[0].agencyMonthsPaymentAdvance,
                    cautionMonthsPaymentAdvance:
                        property.listings[0].cautionMonthsPaymentAdvance,
                    availableFrom: property.listings[0].availableFrom,
                    description: property.listings[0].description,
                    housingFee: property.listings[0].housingFee,
                    housingPeriod: property.listings[0].housingPeriod,
                    active: true
                }
            });

            return { success: true };
        })
});
