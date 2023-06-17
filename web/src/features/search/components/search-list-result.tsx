'use client';
import * as React from 'react';

// components
import { SearchSkeleton } from './search-skeleton';
import { PaginationWrapper } from './pagination-wrapper';
import { PropertySearchCard } from './search-card-wrapper';
import { FiltersDesktop } from './filters-desktop';
import { NextLinkButton } from '~/features/shared/components/next-link';

// utils
import { clsx, range } from '@locaci/ui/lib/functions';
import { t } from '~/app/(routes)/trpc-client-provider';
import {
    getPropertyTitle,
    getTitleForSearchParams,
    parseSearchParams
} from '~/lib/functions';
import { useURLSearchParams } from '~/features/search/hooks/use-url-search-params';
import Image from 'next/image';
import { useSearchMapSelectionStore } from '~/lib/store';

// types
export type SearchListResultProps = {
    defaultMunicipalities: { label: string; value: string }[];
};

export function SearchListResult(props: SearchListResultProps) {
    const searchParams = useURLSearchParams();
    const searchParsed = parseSearchParams(searchParams);
    const selectProperty = useSearchMapSelectionStore(
        store => store.selectProperty
    );

    // Omit view from query input
    const { view, ...queryInput } = searchParsed;

    const { isFetching, data } = t.property.search.useQuery(queryInput, {
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    // remove "page" param to pass it to pagination component
    searchParams.delete('page');

    // we keep the old markers while the user move the map, for a better UX
    const oldTotalPages = React.useRef(data?.total_pages ?? 0);

    let total_pages = oldTotalPages.current;
    if (
        data?.total_pages !== undefined &&
        data.total_pages !== oldTotalPages.current
    ) {
        // update total_pages when total_pages changes
        oldTotalPages.current = data.total_pages;
        total_pages = data.total_pages;
    }

    return (
        <div
            className={clsx(
                'w-full flex-col gap-4 px-4 py-8 md:px-8 lg:col-span-3 lg:flex xl:col-span-5',
                {
                    hidden: searchParsed.view === 'MAP',
                    flex: searchParsed.view === 'LIST'
                }
            )}>
            {data?.properties.length !== 0 && (
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
            )}

            {isFetching ? (
                <SearchSkeleton
                    hideMap
                    pagination={
                        <>
                            {total_pages > 1 && (
                                <Pagination
                                    currentPage={searchParsed.page ?? 1}
                                    totalPages={total_pages}
                                    baseQueryString={searchParams.toString()}
                                />
                            )}
                        </>
                    }
                />
            ) : (
                <section className="flex w-full flex-col items-start gap-4 pb-24 lg:pb-0">
                    {data!.properties.length !== 0 && (
                        <h2 className="text-lg">
                            <strong className="font-medium">
                                {data?.total} résultat
                                {data!.total !== 1 ? 's' : ''}
                            </strong>
                            &nbsp;
                            <span className="text-gray">
                                trouvé{data!.total !== 1 ? 's' : ''}
                            </span>
                        </h2>
                    )}

                    <ul className="grid w-full place-content-stretch place-items-stretch gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {data!.properties.length === 0 ? (
                            <li className="flex w-full flex-col gap-4 sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3 2xl:col-span-4">
                                <h1 className="w-full text-2xl font-medium">
                                    Aucun résultat trouvé pour votre recherche
                                </h1>

                                <h2>
                                    Modifiez ou supprimez certains de vos
                                    filtres, ou ajustez votre zone de recherche
                                    pour avoir des résultats.
                                </h2>

                                <div className="flex items-center gap-4">
                                    <div className="hidden flex-shrink-0 lg:flex">
                                        <FiltersDesktop
                                            defaultMunicipalities={
                                                props.defaultMunicipalities
                                            }
                                        />
                                    </div>
                                    <NextLinkButton href="/search">
                                        Effacer tous les filtres
                                    </NextLinkButton>
                                </div>
                            </li>
                        ) : (
                            data!.properties.map(({ document: p }) => (
                                <li key={p.id} className={`h-full w-full`}>
                                    <PropertySearchCard
                                        onMouseEnter={() => {
                                            selectProperty(p.id);
                                        }}
                                        onMouseLeave={() => {
                                            selectProperty(null);
                                        }}
                                        address={p.address}
                                        housingPeriod={p.housingPeriod}
                                        className={`h-full w-full`}
                                        href={`/properties/${p.id}`}
                                        // @ts-expect-error
                                        customImage={Image}
                                        imagesURL={p.images}
                                        numberOfBedRooms={p.noOfBedRooms}
                                        numberOfRooms={p.noOfRooms}
                                        price={p.housingFee}
                                        surfaceArea={p.surface}
                                        title={getPropertyTitle(p)}
                                    />
                                </li>
                            ))
                        )}
                    </ul>

                    {total_pages > 1 && (
                        <Pagination
                            currentPage={searchParsed.page ?? 1}
                            totalPages={total_pages}
                            baseQueryString={searchParams.toString()}
                        />
                    )}
                </section>
            )}
        </div>
    );
}

const Pagination = React.memo(PaginationWrapper);
