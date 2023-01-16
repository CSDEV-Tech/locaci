'use client';

import * as React from 'react';
// components
import { MapPin } from '@locaci/ui/components/molecules/map-pin';
import { House } from 'phosphor-react';

// utils
import { env } from '~/env/client.mjs';
import mapboxgl from 'mapbox-gl';

// types
import type { BoundingBox, OSMDetailResultData } from '~/utils/types';
import { clsx } from '@locaci/ui/lib/functions';

export type MapProps = {
    markers?: OSMDetailResultData[];
    boundingbox: BoundingBox;
    className?: string;
    hidePolygons?: boolean;
};

// set mapbox token
mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_KEY;

export default function Map({
    markers = [],
    boundingbox,
    className,
    hidePolygons = false
}: MapProps) {
    const mapRef = React.useRef<HTMLDivElement>(null);
    const markersRef = React.useRef<HTMLDivElement[]>([]);
    const id = React.useId();

    // Initialize map object when component mounts
    React.useEffect(() => {
        let map: mapboxgl.Map;
        if (markers.length > 0 && mapRef.current) {
            map = new mapboxgl.Map({
                container: mapRef.current!,
                style: 'mapbox://styles/mapbox/streets-v11',
                bounds: boundingbox
            });
            // Add navigation control (the +/- zoom buttons)
            map.addControl(new mapboxgl.NavigationControl(), 'top-right');
            map.on('load', () => {
                for (let index = 0; index < markers.length; index++) {
                    const marker = markers[index];

                    if (!hidePolygons) {
                        // add map polygon
                        map.addSource(`source-${id}-${index}`, {
                            type: 'geojson',
                            data: {
                                properties: [],
                                type: 'Feature',
                                geometry: marker.geometry
                            }
                        });

                        // Add a new layer to visualize the polygon.
                        map.addLayer({
                            id: `source-${id}-${index}`,
                            type: 'fill',
                            source: `source-${id}-${index}`, // reference the data source
                            layout: {},
                            paint: {
                                'fill-color': '#3a3335', // dark color fill
                                'fill-opacity': 0.3
                            }
                        });

                        // Add a black outline around the polygon.
                        map.addLayer({
                            id: 'outline',
                            type: 'line',
                            source: `source-${id}-${index}`,
                            layout: {},
                            paint: {
                                'line-color': '#3a3335',
                                'line-width': 1
                            }
                        });
                    }

                    // create marker
                    new mapboxgl.Marker(markersRef.current[index]!)
                        .setLngLat([
                            Number(marker.centroid.coordinates[0]),
                            Number(marker.centroid.coordinates[1])
                        ])
                        .addTo(map);
                }
            });
        }
        // Clean up on unmount
        return () => map?.remove();
    }, [markers, boundingbox, hidePolygons]);

    return (
        <>
            <template>
                {markers.map(_ => (
                    <MapPin
                        ref={el => {
                            // add all the divs to ref
                            if (el) {
                                markersRef.current.push(el);
                            }
                        }}
                        children={
                            <div className="rounded-md bg-white p-2 shadow-md">
                                <House
                                    className="h-4 w-4 text-dark"
                                    weight="fill"
                                />
                            </div>
                        }
                    />
                ))}
            </template>

            <div ref={mapRef} className={clsx(className, `h-full w-full`)} />
        </>
    );
}
