'use client';
import * as React from 'react';

// components
import { MapPin } from '@locaci/ui/components/molecules/map-pin';
import { HouseIcon } from '@locaci/ui/components/atoms/icons/house';

// utils
import dynamic from 'next/dynamic';
import { t } from '~/app/trpc-client-provider';

// lazy load the map component
const Map = dynamic(() => import('~/features/shared/components/map'), {
    ssr: false
});

// types
import type { BoundingBox } from '~/lib/types';
import type { MarkerProps } from '~/features/shared/components/map';
export type ClientMapProps = {
    locality_osm_id: string;
    boundingbox: BoundingBox;
};

export function PropertyDetailMap(props: ClientMapProps) {
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
        <>
            {data && (
                <Map
                    markers={[
                        {
                            center: [
                                Number(data.centroid.coordinates[1]),
                                Number(data.centroid.coordinates[0])
                            ],
                            id: props.locality_osm_id,
                            geojson: data.geometry
                        }
                    ]}
                    markerComponent={Marker}
                    boundingbox={props.boundingbox}
                />
            )}
        </>
    );
}

function Marker(props: MarkerProps) {
    return (
        <MapPin
            id={`${props.baseId}-${props.id}`}
            children={
                <div className="rounded-md bg-white p-2 shadow-md">
                    <HouseIcon className="h-4 w-4 text-dark" weight="fill" />
                </div>
            }
        />
    );
}
