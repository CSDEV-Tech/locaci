import { adminRouter } from './admin/index';
import { authRouter } from './auth';
import { ownerRouter } from './owner/property';
import { propertyRouter } from './property';

import { TRPCError } from '@trpc/server';
import { compareStrIgnoreAccent, jsonFetch } from '~/utils/functions';

import { env } from '~/env/server.mjs';
import { z } from 'zod';
import { t } from '../trpc-server-root';

import type { OSMResultData } from '~/utils/types';

export const appRouter = t.router({
    property: propertyRouter,
    auth: authRouter,
    admin: adminRouter,
    owner: t.router({
        property: ownerRouter
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
                        'garden',
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

                    const isALeisurePlace = compareStrIgnoreAccent(
                        el.address.leisure,
                        locality.name
                    );

                    return (
                        isOfCorrectType &&
                        (isInCity ||
                            isInMunicipality ||
                            isAnIndustrationPlace ||
                            isAVillagePlace ||
                            isANeighbourhoodPlace ||
                            isALeisurePlace ||
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
});

// export type definition of API
export type AppRouter = typeof appRouter;
