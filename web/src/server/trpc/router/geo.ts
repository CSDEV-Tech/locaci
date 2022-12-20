import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { env } from '~/env/server.mjs';
import { t } from '~/server/trpc/trpc-server-root';
import { apiFetch, compareStrIgnoreAccent } from '~/utils/functions';
import type { OSMDetailResultData, OSMResultData } from '~/utils/types';
import { Uuid } from '~/utils/uuid';

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
                locality: z.string(),
                municipality: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            // Search for municipality
            let osmCommuneApiresult: Record<string, OSMResultData> = {};
            try {
                let { httpStatus: statusCode, ...rest } = await apiFetch<
                    Record<string, OSMResultData>
                >(
                    `${env.OSM_SEARCH_URL}/search.php?q=${encodeURIComponent(
                        input.municipality
                    )}&format=jsonv2&polygon_geojson=1&addressdetails=1&accept-language=fr-FR`
                );
                osmCommuneApiresult = rest;
            } catch (error) {
                console.error((error as Error).message);
                console.error((error as Error).stack);
                return [];
            }

            const municipalities = Object.values(osmCommuneApiresult);
            const municipality = municipalities.find(m => {
                return m.category === 'boundary' && m.type === 'administrative';
            });

            if (!municipality) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "La commune que vous recherchez n'existe pas"
                });
            }

            // Search for locality
            const searchParams = new URLSearchParams();
            searchParams.append('format', 'json');
            searchParams.append('polygon_geojson', '1');
            searchParams.append('addressdetails', '1');
            searchParams.append('accept-language', 'fr-FR');
            searchParams.append('bounded', '1');
            searchParams.append('viewbox', municipality!.boundingbox.join(','));
            searchParams.append('q', input.locality);

            const { httpStatus, ...osmApiresult } = await apiFetch<
                Record<string, OSMResultData>
            >(`${env.OSM_SEARCH_URL}/search.php?${searchParams.toString()}`);

            const localities = Object.values(osmApiresult);
            let localityRes = localities.filter(el => {
                const ignoredCategories = new Set([
                    'highway',
                    'military',
                    'barrier',
                    'geological',
                    'power',
                    'public_transport',
                    'railway',
                    'route',
                    'telecom',
                    'water',
                    'waterway',
                    'junction',
                    'boundary'
                ]);

                const isOfIgnoredCorrectCategory =
                    ignoredCategories.has(el.category) ||
                    ignoredCategories.has(el.class);

                const isAirport =
                    el.category === 'aeroway' && el.type === 'aerodrome';

                const isInMunicipality = compareStrIgnoreAccent(
                    el.address.municipality,
                    input.municipality
                );

                const isInCity = compareStrIgnoreAccent(
                    el.address.city,
                    input.municipality
                );

                const isAnIndustrationPlace = compareStrIgnoreAccent(
                    el.address.industrial,
                    input.locality
                );

                const isAVillagePlace = compareStrIgnoreAccent(
                    el.address.village,
                    input.locality
                );
                const isANeighbourhoodPlace = compareStrIgnoreAccent(
                    el.address.neighbourhood,
                    input.locality
                );
                const isAResidentialPlace = compareStrIgnoreAccent(
                    el.address.residential,
                    input.locality
                );

                const isALeisurePlace = compareStrIgnoreAccent(
                    el.address.leisure,
                    input.locality
                );

                const isHamletInTown = compareStrIgnoreAccent(
                    el.address.town,
                    input.municipality
                );

                return (
                    (!isOfIgnoredCorrectCategory || isAirport) &&
                    (isInCity ||
                        isInMunicipality ||
                        isAnIndustrationPlace ||
                        isAVillagePlace ||
                        isANeighbourhoodPlace ||
                        isALeisurePlace ||
                        isAResidentialPlace ||
                        isHamletInTown)
                );
            });

            // search by municipality when the locality has not been found
            if (!localityRes) {
                const { httpStatus, ...osmApiresult } = await apiFetch<
                    Record<string, OSMResultData>
                >(
                    `${env.OSM_SEARCH_URL}/search.php?q=${encodeURIComponent(
                        input.municipality
                    )}&format=jsonv2&polygon_geojson=1&accept-language=fr-FR`
                );

                const municipalities = Object.values(osmApiresult);
                localityRes = municipalities.filter(
                    el => el.type === 'administrative'
                );
            }

            console.dir(
                {
                    res: localityRes,
                    locality: input.locality,
                    municipality: input.municipality
                },
                { depth: null }
            );

            return localityRes.map(locality => ({
                ...locality,
                boundingbox: [
                    Number(locality.boundingbox[2]),
                    Number(locality.boundingbox[0]),
                    Number(locality.boundingbox[3]),
                    Number(locality.boundingbox[1])
                ] as [number, number, number, number] // minLon,minLat,maxLon,maxLat
                // this transform boundingbox values to the values that mapbox accepts
            }));
        }),
    getLocalityByOSMID: t.procedure
        .input(
            z.object({
                osm_place_id: z.string().min(1)
            })
        )
        .query(async ({ ctx, input }) => {
            const { httpStatus, ...osmApiresult } = await apiFetch<
                OSMDetailResultData | { error: { message: string } }
            >(
                `${
                    env.OSM_SEARCH_URL
                }/details.php?place_id=${encodeURIComponent(
                    input.osm_place_id
                )}&format=json&polygon_geojson=1&addressdetails=1&accept-language=fr-FR`
            );

            if (!isResultSuccess(osmApiresult)) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: osmApiresult.error.message
                });
            }

            return {
                ...osmApiresult
            };
        }),
    getAllMunicipalities: t.procedure.query(async ({ ctx }) => {
        let municipalities = await ctx.prisma.municipality
            .findMany({
                orderBy: {
                    name: 'asc'
                }
            })
            .then(municipalities =>
                municipalities.map(m => ({
                    ...m,
                    id: new Uuid(m.id).short()
                }))
            );

        return municipalities;
    })
});

function isResultSuccess(
    result: OSMDetailResultData | { error: { message: string } }
): result is OSMDetailResultData {
    return !result.hasOwnProperty('error');
}
