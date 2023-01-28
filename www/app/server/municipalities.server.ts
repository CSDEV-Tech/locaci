import { prisma } from '~/www/db.server';
import { Cache, CacheKeys } from '~/www/lib/cache.server';
import { Uuid } from '~/www/lib/uuid';

export async function getAllMunicipalities() {
    let municipalities = await Cache.get(CacheKeys.municipalities.all(), () =>
        prisma.municipality.findMany({
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
            name: m.name,
            previewPhotoURL: m.previewPhotoURL,
            id: new Uuid(m.id).short(),
            propertyCount: m.properties.length
        }))
    );

    return municipalities;
}
