// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '@web/server/trpc/router';
import { createContext } from '@web/server/trpc/context';

// export API handler
export default createNextApiHandler({
    router: appRouter,
    createContext: createContext
});
