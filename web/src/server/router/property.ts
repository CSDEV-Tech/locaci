import { createRouter } from './context';
import { z } from 'zod';

export const propertyRouter = createRouter().query('getLastThreeCreated', {
    async resolve({ ctx }) {
        return await ctx.prisma.property.findMany({
            where: {
                archived: false
            },
            take: 3,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
});
