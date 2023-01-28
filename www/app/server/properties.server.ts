import { z } from 'zod';
import { prisma } from '~/www/db.server';
import { Cache, CacheKeys } from '~/www/lib/cache.server';
import { Uuid } from '~/www/lib/uuid';
import { parseSearchParams } from './utils.server';

const recentPropertiesSchema = z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish(),
    initialCursor: z.string().nullish()
});

export async function getRecentProperties(request: Request) {
    const input = parseSearchParams(request, recentPropertiesSchema);

    const limit = input.limit ?? 6;
    const cursor = input.cursor ?? input.initialCursor;

    const query = () =>
        prisma.property.findMany({
            where: {
                archived: false,
                activeForListing: true
            },
            take: limit + 1,
            cursor: cursor
                ? {
                      id: cursor
                  }
                : undefined,
            orderBy: {
                createdAt: 'desc'
            }
        });

    // Only cache the first call to "recent" with no cursor
    const properties = cursor
        ? await query()
        : await Cache.get(
              CacheKeys.properties.recent(),
              query,
              24 * 60 * 60 // cache this request for 1 day
          );

    let nextCursor: string | undefined = undefined;

    if (properties.length > limit) {
        // Remove the last item and use it as next cursor
        const lasProperty = properties.pop()!;
        nextCursor = lasProperty.id;
    }

    return {
        properties: properties.map(p => ({
            images: p.images,
            noOfRooms: p.noOfRooms,
            surfaceArea: p.surfaceArea,
            housingFee: p.housingFee,
            housingPeriod: p.housingPeriod,
            address: p.localityName,
            rentType: p.rentType,
            id: new Uuid(p.id).short()
        })),
        nextCursor
    };
}
