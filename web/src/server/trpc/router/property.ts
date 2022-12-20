import { t } from '../trpc-server-root';

export const propertyRouter = t.router({
    getLastThreeCreated: t.procedure.query(async ({ ctx }) => {
        return await ctx.prisma.property.findMany({
            where: {
                archived: false,
                activeForListing: true
            },
            take: 3,
            orderBy: {
                createdAt: 'desc'
            }
        });
    })
});
