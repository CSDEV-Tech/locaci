'use client';

// utils
import { t } from '~/app/trpc-client-provider';
import { parseSearchParams } from '~/lib/functions';
import { useURLSearchParams } from '~/features/search/hooks/use-url-search-params';
import { clsx } from '@locaci/ui/lib/functions';
import { MapPin } from '@locaci/ui/components/molecules/map-pin';
import { PriceTagButton } from '@locaci/ui/components/atoms/price-tag-button';
import dynamic from 'next/dynamic';

// types
import type { MarkerProps } from '~/features/shared/components/map';

// lazy load the map component
const Map = dynamic(() => import('~/features/shared/components/map'), {
    ssr: false
});

export function SearchMap() {
    const searchParams = useURLSearchParams();
    const searchParsed = parseSearchParams(searchParams);
    // Omit view from query input
    const { view, ...queryInput } = searchParsed;

    const { data, isFetching } = t.property.search.useQuery(queryInput, {
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    console.log({
        bbox: searchParsed.bbox
    });

    return (
        <>
            <section
                className={clsx(
                    'sticky top-0 z-0 h-[80vh] md:h-[78.5vh] lg:col-span-2 lg:block lg:h-screen xl:col-span-3',
                    {
                        hidden: searchParsed.view === 'LIST',
                        block: searchParsed.view === 'MAP'
                    }
                )}>
                <div className="flex h-full w-full items-center justify-center bg-primary-15">
                    <Map
                        key={searchParsed.view}
                        boundingbox={searchParsed.bbox!}
                        markers={[]}
                        markerComponent={Marker}
                        className="h-full w-full"
                    />
                </div>
            </section>
        </>
    );
}

function Marker(props: MarkerProps) {
    return (
        <MapPin
            id={`${props.baseId}-${props.id}`}
            children={
                <div
                    data-type="search-marker"
                    data-id={`${props.baseId}-${props.id}`}
                    className="rounded-md bg-white p-2 shadow-md">
                    <PriceTagButton price={50_000} />
                </div>
            }
        />
    );
}
