import { t } from '~/server/trpc/root';
import { isLoggedIn } from '~/server/trpc/middleware/auth';
import { convertDateToBeginOfDate } from '~/lib/functions';

const protectedProcedure = t.procedure.use(isLoggedIn);

export const userRouter = t.router({
    getBookings: protectedProcedure.query(async ({ ctx, input }) => {
        const futureBookings = await ctx.prisma.propertyBooking.findMany({
            where: {
                userId: ctx.user.id,
                dateOfReservation: {
                    gte: convertDateToBeginOfDate(new Date())
                }
            },
            include: {
                property: {
                    include: {
                        rooms: true
                    }
                }
            }
        });

        const pastBookings = await ctx.prisma.propertyBooking.findMany({
            where: {
                userId: ctx.user.id,
                dateOfReservation: {
                    lt: convertDateToBeginOfDate(new Date())
                }
            },
            include: {
                property: {
                    include: {
                        rooms: true
                    }
                }
            }
        });

        return {
            futureBookings,
            pastBookings
        };
    })
});
