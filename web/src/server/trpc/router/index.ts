import { t } from '../trpc-server-root';
import { adminRouter } from './admin/index';
import { authRouter } from './auth';
import { ownerRouter } from './owner/property';
import { propertyRouter } from './property';

export const appRouter = t.router({
    property: propertyRouter,
    auth: authRouter,
    admin: adminRouter,
    owner: t.router({
        property: ownerRouter
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;
