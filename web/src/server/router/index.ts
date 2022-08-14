// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { propertyRouter } from './property';

export const appRouter = createRouter()
    .transformer(superjson)
    .merge('property.', propertyRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
