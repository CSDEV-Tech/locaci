import { createContext } from '~/server/trpc/context';
import { appRouter } from '~/server/trpc/router';
import { createTRPCNextLayout } from './createTRPCNextLayout';
import { getUser } from './getUser';
import superjson from 'superjson';

export const rsc = createTRPCNextLayout({
    router: appRouter,
    transformer: superjson,
    createContext() {
        return createContext({
            type: 'rsc',
            getUser
        });
    }
});
