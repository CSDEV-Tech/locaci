'use client';

// utils
import { t } from '~/app/trpc-client-provider';
import { parseSearchParams } from '~/lib/functions';
import { useURLSearchParams } from '~/features/search/hooks/use-url-search-params';

export function SearchMap() {
    const searchParams = useURLSearchParams();
    const searchParsed = parseSearchParams(searchParams);

    const { data, isFetching } = t.property.search.useQuery(searchParsed, {
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    return (
        <>
            <section className="hidden lg:col-span-2 lg:block">
                <div className="flex h-full w-full items-center justify-center bg-primary-15">
                    {isFetching && <span>Loading...</span>}
                </div>
            </section>
        </>
    );
}
