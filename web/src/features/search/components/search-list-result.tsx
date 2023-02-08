'use client';
import * as React from 'react';

// components
import { SearchSkeleton } from './search-skeleton';
import { PaginationWrapper } from './pagination-wrapper';
import { PropertySearchCard } from './search-card-wrapper';
import { FiltersDesktop } from './filters-desktop';
import { NextLink } from '~/features/shared/components/next-link';

// utils
import { clsx, range } from '@locaci/ui/lib/functions';
import { t } from '~/app/trpc-client-provider';
import { getTitleForSearchParams, parseSearchParams } from '~/lib/functions';
import { useURLSearchParams } from '~/features/search/hooks/use-url-search-params';

// types
export type SearchListResultProps = {
    defaultMunicipalities: { label: string; value: string }[];
};

export function SearchListResult(props: SearchListResultProps) {
    const searchParams = useURLSearchParams();
    const searchParsed = parseSearchParams(searchParams);

    const { isFetching, data } = t.property.search.useQuery(searchParsed, {
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    // remove "page" param to pass it to pagination component
    searchParams.delete('page');

    return (
        <div
            className={clsx(
                'flex w-full flex-col gap-4 px-4 py-8 md:px-8 lg:col-span-3'
            )}>
            <div className="flex items-start gap-8">
                <h1 className="text-2xl font-medium">
                    {getTitleForSearchParams(searchParsed)}
                </h1>
                <div className="hidden flex-shrink-0 lg:flex">
                    <FiltersDesktop
                        defaultMunicipalities={props.defaultMunicipalities}
                    />
                </div>
            </div>

            {isFetching ? (
                <SearchSkeleton
                    hideMap
                    paginationComponent={
                        <Pagination
                            currentPage={searchParsed.page ?? 1}
                            totalPages={5}
                            baseQueryString={searchParams.toString()}
                        />
                    }
                />
            ) : (
                <section className="flex w-full flex-col items-start gap-4">
                    <h2 className="text-lg">
                        <strong className="font-medium">8 résultats</strong>
                        &nbsp;
                        <span className="text-gray">trouvés</span>
                    </h2>

                    <ul className="grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {range(0, 20).map(i => (
                            <li key={i} className={`w-full`}>
                                <PropertySearchCard
                                    address="Riviera 6, cocody, abidjan"
                                    housingPeriod={30}
                                    className={`w-full`}
                                    href="/search/#"
                                    customLink={NextLink}
                                    imagesURL={[
                                        'https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
                                        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1558&q=80',
                                        'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
                                    ]}
                                    numberOfBedRooms={1}
                                    numberOfRooms={2}
                                    price={50000}
                                    surfaceArea={9}
                                    title="Studio en colocation"
                                />
                            </li>
                        ))}
                    </ul>

                    <Pagination
                        currentPage={searchParsed.page ?? 1}
                        totalPages={5}
                        baseQueryString={searchParams.toString()}
                    />
                </section>
            )}
        </div>
    );
}

const Pagination = React.memo(PaginationWrapper);
