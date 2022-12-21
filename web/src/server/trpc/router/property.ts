import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { Uuid } from '~/utils/uuid';
import { t } from '../trpc-server-root';

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

            const properties = await ctx.prisma.property.findMany({
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
        })
});
