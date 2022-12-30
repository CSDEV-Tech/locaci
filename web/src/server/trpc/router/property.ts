import { z } from 'zod';
import { Uuid } from '~/utils/uuid';
import { t } from '~/server/trpc/trpc-server-root';
import { Cache, CacheKeys } from '~/server/cache';

export const propertyRouter = t.router({
    getRecentProperties: t.procedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).nullish(),
                cursor: z.string().nullish(),
                initialCursor: z.string().nullish()
            })
        )
        .query(async ({ ctx, input }) => {
            const limit = input.limit ?? 4;
            const cursor = input.cursor ?? input.initialCursor;

            const query = () =>
                ctx.prisma.property.findMany({
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
                    ...p,
                    id: new Uuid(p.id).short()
                })),
                nextCursor
            };
        }),
    getPropertyDetail: t.procedure
        .input(
            z.object({
                uid: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const uid = Uuid.fromShort(input.uid);

            const property = await Cache.get(
                CacheKeys.properties.single(uid.toString()),
                () =>
                    ctx.prisma.property.findFirst({
                        where: {
                            id: uid.toString(),
                            activeForListing: true,
                            archived: false
                        },
                        include: {
                            amenities: true,
                            city: true,
                            municipality: true,
                            owner: true,
                            rooms: true
                        }
                    })
            );

            const similarProperties = property
                ? await Cache.get(
                      CacheKeys.properties.similar(uid.toString()),
                      () =>
                          ctx.prisma.property.findMany({
                              where: {
                                  id: { not: uid.toString() },
                                  municipalityId: property?.municipalityId,
                                  activeForListing: true,
                                  archived: false
                              },
                              take: 3,
                              orderBy: {
                                  createdAt: 'desc'
                              }
                          })
                  )
                : [];

            return property
                ? {
                      ...property,
                      similar: similarProperties.map(p => ({
                          ...p,
                          id: new Uuid(p.id).short()
                      }))
                  }
                : null;
        })
});
