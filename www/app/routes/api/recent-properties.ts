import { json } from '@remix-run/node';
import { getRecentProperties } from '~/www/server/properties.server';

import type { LoaderArgs } from '@remix-run/node';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiFetch } from '~/www/lib/functions';

export async function loader({ request }: LoaderArgs) {
    return json({
        ...(await getRecentProperties(request))
    });
}

export function RecentProperties() {
    return null;
}

export function useRecentProperties() {
    return useInfiniteQuery({
        queryKey: ['properties', 'recent', { limit: 6 }],
        queryFn: async ({ pageParam }) => {
            return await apiFetch<ReturnType<typeof getRecentProperties>>(
                `/api/recent-properties` +
                    (pageParam ? `?cursor=${pageParam}` : '')
            );
        },
        getNextPageParam(lastPage) {
            return lastPage.nextCursor;
        },
        refetchOnMount: false,
        staleTime: Infinity
    });
}
