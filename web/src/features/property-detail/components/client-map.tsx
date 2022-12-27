'use client';
import * as React from 'react';
// components
import { LoadingIndicator } from '@locaci/ui/components/atoms/loading-indicator';

// utils
import dynamic from 'next/dynamic';
import { t } from '~/app/trpc-client-provider';

// lazy load the map component
const Map = dynamic(() => import('~/features/shared/components/map'), {
    ssr: false
});

// types
import type { BoundingBox } from '~/utils/types';
export type ClientMapProps = {
    locality_osm_id: string;
    boundingbox: BoundingBox;
};

export function ClientMap(props: ClientMapProps) {
    return (
        <div className="relative h-[25rem] bg-primary-15 md:h-[32rem]">
            <React.Suspense
                fallback={
                    <div className="absolute top-1/2 left-1/2 inline-flex -translate-y-1/2 -translate-x-1/2 items-center gap-2">
                        <LoadingIndicator className="h-4 w-4" />
                        <span>Chargement de la carte</span>
                    </div>
                }>
                <MapLoader
                    locality_osm_id={props.locality_osm_id}
                    boundingbox={props.boundingbox}
                />
            </React.Suspense>
        </div>
    );
}

/**
 * A wrapper around the map loading
 * @param props
 * @returns
 */
function MapLoader(props: ClientMapProps) {
    const { data } = t.geo.getLocalityByOSMID.useQuery(
        {
            osm_place_id: props.locality_osm_id
        },
        {
            suspense: true
        }
    );

    return (
        <>
            <Map localityData={data} boundingbox={props.boundingbox} />
        </>
    );
}
