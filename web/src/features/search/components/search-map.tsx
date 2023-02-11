'use client';
import * as React from 'react';

// components
import { MapPin } from '@locaci/ui/components/molecules/map-pin';
import { useOnClickOutside } from '@locaci/ui/lib/hooks';
import { PriceTagButton } from '@locaci/ui/components/atoms/price-tag-button';
import { LoadingIndicator } from '@locaci/ui/components/atoms/loading-indicator';
import { PropertySearchCard } from './search-card-wrapper';
import Image from 'next/image';

// utils
import { t } from '~/app/trpc-client-provider';
import { getPropertyTitle, parseSearchParams } from '~/lib/functions';
import { useURLSearchParams } from '~/features/search/hooks/use-url-search-params';
import { clsx } from '@locaci/ui/lib/functions';
import { useSearchMapSelectionStore } from '~/lib/store';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';

// types
import type { Marker, MarkerProps } from '~/features/shared/components/map';
import type { RouterOutput } from '~/lib/types';
import useMediaQuery from '~/features/shared/hooks/use-media-query';
type SearchItems = RouterOutput['property']['search']['properties'];
type Markers = Array<
    SearchItems[number]['document'] & {
        price: number;
    }
>;

// lazy load the map component
const Map = dynamic(() => import('~/features/shared/components/map'), {
    ssr: false
});

function selectPin(pin: HTMLElement | null) {
    pin?.setAttribute('aria-pressed', 'true');

    const parentLeafletPopup = pin?.closest(
        '.leaflet-popup'
    ) as HTMLElement | null;
    if (parentLeafletPopup) {
        parentLeafletPopup.style.zIndex = '5';
    }
}
function deselectPin(pin: HTMLElement | null) {
    pin?.removeAttribute('aria-pressed');
    const parentLeafletPopup = pin?.closest(
        '.leaflet-popup'
    ) as HTMLElement | null;
    if (parentLeafletPopup) {
        parentLeafletPopup.style.removeProperty('z-index');
    }
}

export function SearchMap() {
    // for form submission
    const searchParams = useURLSearchParams();
    const searchParsed = parseSearchParams(searchParams);
    const router = useRouter();

    // for selected popup state
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const hoveredId = useSearchMapSelectionStore(store => store.selectedId);
    const [markersPopupContainers, setMarkersPopupContainers] = React.useState<
        Record<string, HTMLElement>
    >({});

    const { view, ...queryInput } = searchParsed;
    const { data, isFetching } = t.property.search.useQuery(queryInput, {
        staleTime: 5 * 60 * 1000, // 5 minutes
        trpc: {
            abortOnUnmount: true
        }
    });

    // we keep the old markers while the user moves the map, for a better UX
    // The reason why we use refs is to have referential stability and not issue a rerender when the
    // data has not changed
    const oldProperties = React.useRef<SearchItems>([]);
    const oldMarkers = React.useRef<Markers>([]);

    // calculate the marker props to show into the map
    const markers = React.useMemo(() => {
        let markers: Markers = [];

        if (data?.properties && data.properties !== oldProperties.current) {
            oldProperties.current = data.properties;
            oldMarkers.current = data.properties.map(({ document: doc }) => ({
                ...doc,
                price: doc.housingFee
            }));

            markers = oldMarkers.current;
        } else {
            markers = oldMarkers.current;
        }

        return markers satisfies Marker[];
    }, [data?.properties]);

    // Highlight the currently hovered property in the map
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

    // function to setup event handlers for when the user clicks on a pin in the map
    const onMarkersLoaded = React.useCallback(() => {
        const pins = document.querySelectorAll('[data-type="search-map-pin"]');

        const onPinClick = (e: Event) => {
            const element = e.target as HTMLButtonElement;

            const selectedPins = document.querySelectorAll(
                '[data-type="search-map-pin"][aria-pressed="true"]'
            );
            // Deselect all currently selected pins
            selectedPins.forEach(pin => {
                deselectPin(pin as HTMLElement);
            });

            // select the correct pin
            selectPin(element);

            // Get the card shown in the list on mobile view and scroll to it
            const cardElement = document.querySelector(
                `li#map-card-${element.id}`
            ) as HTMLLIElement | null;
            if (cardElement) {
                cardElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            setSelectedId(element.id);
        };

        const popupContainers: Record<string, HTMLElement> = {};

        pins.forEach(pin => {
            pin.addEventListener('click', onPinClick);
            // Previous Sibling is the container where the selected property will be shown
            if (pin.previousElementSibling) {
                popupContainers[pin.id] =
                    pin.previousElementSibling as HTMLElement;
            }
        });

        // deselect the currently selected pin
        setSelectedId(null);
        setMarkersPopupContainers(popupContainers);
        return () => {
            pins.forEach(pin => {
                pin.removeEventListener('click', onPinClick);
            });
        };
    }, []);

    // Deselect the current popup when the user clicks outside of it
    const selectedPropertyCardRef = React.useRef<HTMLElement>(null);
    useOnClickOutside(
        selectedPropertyCardRef,
        () => {
            if (selectedId !== null) {
                const selectedPin = document.querySelector(
                    `[data-type="search-map-pin"][id="${selectedId}"]`
                ) as HTMLElement | null;
                deselectPin(selectedPin);
            }

            setSelectedId(null);
        },
        'mouseup'
    );

    // this is to fix a bug where even if the map is hidden, leaflet still registers a 'move' event
    // and updates the coordinates, the fix is to not show the map if it is not in view, and always show the map in desktop
    const isDesktop = useMediaQuery(`(min-width: 1024px)`);
    const isTablet = useMediaQuery(`(max-width: 1023px)`);
    const canShowMap = (isTablet && searchParsed.view === 'MAP') || isDesktop;

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

                    {canShowMap && (
                        <Map
                            boundingbox={searchParsed.bbox!}
                            markers={markers}
                            markerComponent={Marker}
                            onMarkersLoaded={onMarkersLoaded}
                            className="z-0 h-full w-full"
                            onMove={bounds => {
                                const sw = bounds.getSouthWest();
                                const ne = bounds.getNorthEast();
                                const bbox = [sw.lng, sw.lat, ne.lng, ne.lat];

                                // Search in the zone
                                searchParams.delete('bbox');
                                searchParams.delete('municipalityId[label]');
                                searchParams.delete('municipalityId[value]');
                                searchParams.append('bbox', bbox.join(','));

                                router.push(
                                    `/search?${searchParams.toString()}`
                                );
                            }}
                        />
                    )}

                    {markers.map(marker => (
                        <React.Fragment key={`popup-${marker.id}`}>
                            {selectedId === marker.id &&
                                createPortal(
                                    <PropertySearchCard
                                        ref={selectedPropertyCardRef}
                                        address={marker.address}
                                        housingPeriod={marker.housingPeriod}
                                        className={`relative z-10 h-full w-[200px]`}
                                        href={`/properties/${marker.id}`}
                                        // @ts-expect-error
                                        customImage={Image}
                                        imagesURL={marker.images}
                                        numberOfBedRooms={marker.noOfBedRooms}
                                        numberOfRooms={marker.noOfRooms}
                                        price={marker.housingFee}
                                        surfaceArea={marker.surface}
                                        title={getPropertyTitle(marker)}
                                        size="small"
                                    />,
                                    markersPopupContainers[marker.id]
                                )}
                        </React.Fragment>
                    ))}

                    {selectedId && !isFetching && (
                        <ul className="absolute bottom-6 z-10 flex w-full items-stretch gap-4 overflow-scroll px-4 md:hidden">
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
                    <div className="relative z-10 hidden md:block" />

                    <PriceTagButton
                        data-type="search-map-pin"
                        id={props.id}
                        price={props.price}
                        className="relative z-[5]"
                    />
                </div>
            }
        />
    );
}
