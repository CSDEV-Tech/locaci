'use client';
import * as React from 'react';

// utils
import dynamic from 'next/dynamic';
import { t } from '~/app/trpc-client-provider';

// lazy load the map component
const Map = dynamic(() => import('~/features/shared/components/map'), {
    ssr: false
});

// types
import type { BoundingBox } from '~/lib/types';
export type ClientMapProps = {
    locality_osm_id: string;
    boundingbox: BoundingBox;
};

export function ClientMap(props: ClientMapProps) {
    return (
        <div className="relative h-[25rem] bg-primary-15 md:h-[32rem]">
            <MapLoader
                locality_osm_id={props.locality_osm_id}
                boundingbox={props.boundingbox}
            />
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
            staleTime: Infinity,
            refetchOnMount: false
        }
    );

    return (
        <>{data && <Map markers={[data]} boundingbox={props.boundingbox} />}</>
    );
}
