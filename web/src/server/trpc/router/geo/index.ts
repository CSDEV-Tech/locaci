import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { env } from '~/env/server.mjs';
import { t } from '~/server/trpc/trpc-server-root';
import { apiFetch, compareStrIgnoreAccent } from '~/utils/functions';
import type { OSMResultData } from '~/utils/types';

export const geoRouter = t.router({
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

            const { httpStatus, ...osmApiresult } = await apiFetch<
                Record<string, OSMResultData>
            >(
                `${env.OSM_SEARCH_URL}/search.php?q=${encodeURIComponent(
                    locality.name
                )}&format=jsonv2&polygon_geojson=1&addressdetails=1`
            );

            console.dir({ res: osmApiresult, locality }, { depth: null });

            const localities = Object.values(osmApiresult);
            let localityRes =
                localities.filter(el => {
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
                        'garden',
                        'suburb',
                        'hamlet'
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

                    const isALeisurePlace = compareStrIgnoreAccent(
                        el.address.leisure,
                        locality.name
                    );

                    const isHamletInTown = compareStrIgnoreAccent(
                        el.address.town,
                        locality.municipality.name
                    );

                    return (
                        isOfCorrectType &&
                        (isInCity ||
                            isInMunicipality ||
                            isAnIndustrationPlace ||
                            isAVillagePlace ||
                            isANeighbourhoodPlace ||
                            isALeisurePlace ||
                            isAResidentialPlace ||
                            isHamletInTown)
                    );
                })[0] ?? null;

            // search by municipality when the locality has not been found
            if (!localityRes) {
                const { httpStatus, ...osmApiresult } = await apiFetch<
                    Record<string, OSMResultData>
                >(
                    `${env.OSM_SEARCH_URL}/search.php?q=${encodeURIComponent(
                        locality.municipality.name
                    )}&format=jsonv2&polygon_geojson=1`
                );

                const municipalities = Object.values(osmApiresult);
                localityRes = municipalities.filter(
                    el => el.type === 'administrative'
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
});
