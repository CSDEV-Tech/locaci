import { authRouter } from './auth';
import { ownerDraftRouter } from './owner/draft';
import { propertyRouter } from './property';
import { geoRouter } from './geo';
import { ownerStorageRouter } from './owner/storage';
import { ownerPropertiesRouter } from './owner/property';
import { t } from '../trpc-server-root';

export const appRouter = t.router({
    property: propertyRouter,
    auth: authRouter,
    geo: geoRouter,
    owner: t.router({
        draft: ownerDraftRouter,
        property: ownerPropertiesRouter,
        storage: ownerStorageRouter
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;
