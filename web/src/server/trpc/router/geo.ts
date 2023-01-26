import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { env } from '~/env/server.mjs';
import { Cache, CacheKeys } from '~/server/cache';
import { t } from '~/server/trpc/root';
import { apiFetch, convertAccentStringToNormalString } from '~/lib/functions';
import type { OSMDetailResultData, OSMResultData } from '~/lib/types';
import { Uuid } from '~/lib/uuid';

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
        .query(async ({ input }) => {
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
            searchParams.append('countrycodes', 'CI'); // nous ne cherchons qu'en côte d'ivoire
            searchParams.append('q', input.locality);
            searchParams.append('limit', '50');

            const [minLat, maxLat, minLong, maxLong] =
                municipality!.boundingbox;

            searchParams.append(
                'viewbox',
                [minLong, maxLat, maxLong, minLat].join(',')
            );

            const URL = `${
                env.OSM_SEARCH_URL
            }/search.php?${searchParams.toString()}`;
            const { httpStatus, ...osmApiresult } = await apiFetch<
                Record<string, OSMResultData>
            >(URL);

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

                const isInMunicipality = el.address.municipality
                    ? convertAccentStringToNormalString(
                          el.address.municipality
                      ) == convertAccentStringToNormalString(input.municipality)
                    : true;

                return (
                    (!isOfIgnoredCorrectCategory || isAirport) &&
                    isInMunicipality
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
        let municipalities = await Cache.get(
            CacheKeys.municipalities.all(),
            () =>
                ctx.prisma.municipality.findMany({
                    orderBy: {
                        name: 'asc'
                    },
                    select: {
                        name: true,
                        id: true,
                        previewPhotoURL: true,
                        properties: {
                            where: {
                                activeForListing: true,
                                archived: false
                            }
                        }
                    }
                })
        ).then(municipalities =>
            municipalities.map(m => ({
                ...m,
                id: new Uuid(m.id).short(),
                propertyCount: m.properties.length
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
