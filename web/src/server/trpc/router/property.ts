import { Uuid } from '~/utils/uuid';
import { t } from '../trpc-server-root';

export const propertyRouter = t.router({
    getLastThreeCreated: t.procedure.query(async ({ ctx }) => {
        const properties = await ctx.prisma.property.findMany({
            where: {
                archived: false,
                activeForListing: true
            },
            take: 3,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return properties.map(p => ({
            ...p,
            id: new Uuid(p.id).short()
        }));
    })
});
