import { cookies } from 'next/headers';

import { cache } from 'react';
import { getUserFromSessionToken } from '~/server/ssr-helpers';
import { AsyncLocalStorage } from 'async_hooks';

import type { User } from '@prisma/client';
interface LocalStorageContext {
    trpc: {};
}

/**
 * I don't know what this does but it works, so don't delete theses lines please
 */
const asyncStorage: AsyncLocalStorage<LocalStorageContext> =
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('next/dist/client/components/request-async-storage').requestAsyncStorage;
asyncStorage.getStore();

export const getUser = cache(async (): Promise<User | null> => {
    const sessionToken = cookies().get(`__session`)?.value;
    return sessionToken ? getUserFromSessionToken(sessionToken) : null;
});
