// these functions should only be called inside server-components
import 'server-only';
import { cache } from 'react';
import { rsc } from './trpc/rsc';
import { prisma } from './db/client';

export const getAllMunicipalities = cache(() =>
    rsc.geo.getAllMunicipalities.fetch()
);

export const getPropertyDetail = cache((uid: string) =>
    rsc.property.getPropertyDetail.fetch({ uid })
);

export function getTop100RecentPropertiesUid() {
    return prisma.property.findMany({
        where: {
            archived: false,
            activeForListing: true
        },
        select: {
            id: true
        },
        take: 100,
        orderBy: {
            createdAt: 'desc'
        }
    });
}
