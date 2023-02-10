'use client';
import * as React from 'react';

// components
import { MapPin } from '@locaci/ui/components/molecules/map-pin';
import { PriceTagButton } from '@locaci/ui/components/atoms/price-tag-button';
import { LoadingIndicator } from '@locaci/ui/components/atoms/loading-indicator';
import { PropertySearchCard } from './search-card-wrapper';
import { NextLink } from '~/features/shared/components/next-link';
import Image from 'next/image';

// utils
import { t } from '~/app/trpc-client-provider';
import { getPropertyTitle, parseSearchParams } from '~/lib/functions';
import { useURLSearchParams } from '~/features/search/hooks/use-url-search-params';
import { clsx } from '@locaci/ui/lib/functions';
import dynamic from 'next/dynamic';

// types
import type { Marker, MarkerProps } from '~/features/shared/components/map';
import { useSearchMapSelectionStore } from '~/lib/store';

// lazy load the map component
const Map = dynamic(() => import('~/features/shared/components/map'), {
    ssr: false
});

export function SearchMap() {
    const searchParams = useURLSearchParams();
    const searchParsed = parseSearchParams(searchParams);
    // Omit view from query input
    const { view, ...queryInput } = searchParsed;
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const { selectProperty, selectedId: hoveredId } =
        useSearchMapSelectionStore();

    const { data, isFetching } = t.property.search.useQuery(queryInput, {
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    const markers = React.useMemo(() => {
        const computed: Marker[] =
            data && data.properties.length > 0
                ? data.properties.map(({ document: doc }) => ({
                      ...doc,
                      price: doc.housingFee
                  }))
                : [];

        return computed;
    }, [data?.properties]);

    React.useEffect(() => {
        const pin = document.querySelector(
            `[data-type="search-map-pin"][id="${hoveredId}"]`
        );

        if (pin) {
            (pin as HTMLElement).dataset.selected = 'true';
        }

        return () => {
            if (pin) {
                (pin as HTMLElement).dataset.selected = 'false';
            }
        };
    }, [hoveredId]);

    function onMarkersLoaded() {
        const pins = document.querySelectorAll('[data-type="search-map-pin"]');

        const listener = (e: Event) => {
            const element = e.target as HTMLButtonElement;
            console.log(`Clicked pin with id: ${element.id}`);

            pins.forEach(pin => {
                pin.removeAttribute('aria-pressed');
                if (pin.previousSibling) {
                    (pin.previousSibling as HTMLDivElement).dataset.selected =
                        'false';
                }
            });
            element.setAttribute('aria-pressed', 'true');
            if (element.previousSibling) {
                (element.previousSibling as HTMLDivElement).dataset.selected =
                    'true';
            }

            console.log({
                next: element.previousSibling
            });

            setSelectedId(element.id);
            const cardElement = document.querySelector(
                `li#map-card-${element.id}`
            ) as HTMLLIElement | null;
            if (cardElement) {
                cardElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        };

        console.log({ pins });
        pins.forEach(pin => {
            pin.addEventListener('click', listener);
        });

        return () => {
            pins.forEach(pin => {
                pin.removeEventListener('click', listener);
            });
        };
    }

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
                <div className="relative flex h-full w-full items-center justify-center bg-primary-15">
                    {isFetching && (
                        <div className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-md bg-white px-4 py-2 text-dark">
                            <LoadingIndicator className="h-4 w-4 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                                Chargement de la carte
                            </span>
                        </div>
                    )}

                    <Map
                        key={searchParsed.view}
                        boundingbox={searchParsed.bbox!}
                        markers={markers}
                        markerComponent={Marker}
                        onMarkersLoaded={onMarkersLoaded}
                        className="z-0 h-full w-full"
                    />

                    {selectedId && !isFetching && (
                        <ul className="absolute bottom-6 z-10 flex w-full items-stretch gap-4 overflow-scroll px-4 lg:hidden">
                            {data?.properties.map(({ document: p }) => (
                                <li
                                    key={`map-card-${p.id}`}
                                    id={`map-card-${p.id}`}>
                                    <PropertySearchCard
                                        address={p.address}
                                        housingPeriod={p.housingPeriod}
                                        className={`h-full w-[200px]`}
                                        href={`/properties/${p.id}`}
                                        // @ts-expect-error
                                        customImage={Image}
                                        imagesURL={p.images}
                                        numberOfBedRooms={p.noOfBedRooms}
                                        numberOfRooms={p.noOfRooms}
                                        price={p.housingFee}
                                        surfaceArea={p.surface}
                                        title={getPropertyTitle(p)}
                                        size="small"
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
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
                <div className="group flex flex-col items-center gap-2">
                    <div className="hidden lg:[&[data-selected='true']]:block">
                        <PropertySearchCard
                            address={props.address}
                            housingPeriod={props.housingPeriod}
                            className={`h-full w-[200px]`}
                            href={`/properties/${props.id}`}
                            customLink={NextLink}
                            // @ts-expect-error
                            customImage={Image}
                            imagesURL={props.images}
                            numberOfBedRooms={props.noOfBedRooms}
                            numberOfRooms={props.noOfRooms}
                            price={props.housingFee}
                            surfaceArea={props.surface}
                            // @ts-ignore
                            title={getPropertyTitle(props)}
                            size="small"
                        />
                    </div>

                    <PriceTagButton
                        data-type="search-map-pin"
                        id={props.id}
                        price={props.price}
                    />
                </div>
            }
        />
    );
}
