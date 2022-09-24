import { TRPCError } from '@trpc/server';
import { env } from '@web/env/server.mjs';
import { isOwner } from '@web/server/trpc/middleware/auth';
import { t } from '@web/server/trpc/trpc-server-root';
import { compareStrIgnoreAccent, jsonFetch } from '@web/utils/functions';
import { z } from 'zod';

// import { createPropertyRequestSchema } from '@web/server/trpc/validation/property-schema';
// import { CreatePropertyController } from '@web/server/trpc/router/controllers/create-property.controller';

import type { OSMResultData } from '@web/utils/types';

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
                        contains: input.name,
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
        }),

    getLocalityData: t.procedure
        .input(
            z.object({
                localityId: z.string().uuid()
            })
        )
        .query(async ({ ctx, input }) => {
            const locality = await ctx.prisma.locality.findFirst({
                where: {
                    id: input.localityId
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
                    code: 'NOT_FOUND',
                    message: "Ce quartier n'existe pas"
                });
            }

            const res = await jsonFetch<Array<OSMResultData>>(
                `${env.OSM_SEARCH_URL}/search.php?q=${encodeURIComponent(
                    locality.name
                )}&format=jsonv2&polygon_geojson=1&addressdetails=1`
            );

            console.dir({ res, locality }, { depth: null });

            let localityRes =
                res.filter(el => {
                    const isOfCorrectType = [
                        'district',
                        'locality',
                        'place',
                        'neighbourhood',
                        'quarter',
                        'village',
                        'hamlet',
                        'residential',
                        'industrial',
                        'administrative',
                        'island',
                        'suburb'
                    ].includes(el.type);

                    const isInMunicipality = compareStrIgnoreAccent(
                        el.address.municipality,
                        locality.municipality.name
                    );

                    const isInCity = compareStrIgnoreAccent(
                        el.address.city,
                        locality.municipality.name
                    );

                    const isAnIndustrationPlace = compareStrIgnoreAccent(
                        el.address.industrial,
                        locality.name
                    );

                    const isAVillagePlace = compareStrIgnoreAccent(
                        el.address.village,
                        locality.name
                    );
                    const isANeighbourhoodPlace = compareStrIgnoreAccent(
                        el.address.neighbourhood,
                        locality.name
                    );
                    const isAResidentialPlace = compareStrIgnoreAccent(
                        el.address.residential,
                        locality.name
                    );

                    return (
                        isOfCorrectType &&
                        (isInCity ||
                            isInMunicipality ||
                            isAnIndustrationPlace ||
                            isAVillagePlace ||
                            isANeighbourhoodPlace ||
                            isAResidentialPlace)
                    );
                })[0] ?? null;

            // search by municipality when the locality has not been found
            if (!localityRes) {
                const res = await jsonFetch<Array<OSMResultData>>(
                    `${env.OSM_SEARCH_URL}/search.php?q=${encodeURIComponent(
                        locality.municipality.name
                    )}&format=jsonv2&polygon_geojson=1`
                );

                localityRes = res.filter(el =>
                    ['administrative'].includes(el.type)
                )[0];
            }

            return {
                ...localityRes,
                // transform boundingbox values to the values that mapbox accepts
                boundingbox: [
                    Number(localityRes.boundingbox[2]),
                    Number(localityRes.boundingbox[0]),
                    Number(localityRes.boundingbox[3]),
                    Number(localityRes.boundingbox[1])
                ] as [number, number, number, number] // minLon,minLat,maxLon,maxLat
            };
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
