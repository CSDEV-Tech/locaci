import { t } from '../trpc-server-root';
import { adminRouter } from './admin/index';
import { authRouter } from './auth';
import { propertyRouter } from './property';

export const appRouter = t.router({
    property: propertyRouter,
    auth: authRouter,
    admin: adminRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
