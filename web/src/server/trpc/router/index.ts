import { authRouter } from './auth';
import { ownerPropertiesRouter } from './owner/property';
import { propertyRouter } from './property';
import { geoRouter } from './geo';
import { t } from '../trpc-server-root';

export const appRouter = t.router({
    property: propertyRouter,
    auth: authRouter,
    geo: geoRouter,
    owner: t.router({
        property: ownerPropertiesRouter
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;
