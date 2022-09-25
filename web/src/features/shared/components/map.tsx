import * as React from 'react';
// components
import { LoadingIndicator, MapPin } from '@locaci/ui';
import { House } from 'phosphor-react';

// utils
import { env } from '@web/env/client.mjs';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// types
import type { OSMResultData } from '@web/utils/types';

export type MapProps = {
    localityData?: OSMResultData | null;
};

// set mapbox token
mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_KEY;

export default function Map({ localityData: data }: MapProps) {
    const mapRef = React.useRef<HTMLDivElement>(null);
    const markerRef = React.useRef<HTMLDivElement>(null);

    // Initialize map object when component mounts
    React.useEffect(() => {
        let map: mapboxgl.Map;
        if (data && mapRef.current) {
            map = new mapboxgl.Map({
                container: mapRef.current!,
                style: 'mapbox://styles/mapbox/streets-v11',
                bounds: data.boundingbox
            });

            // Add navigation control (the +/- zoom buttons)
            map.addControl(new mapboxgl.NavigationControl(), 'top-right');

            map.on('load', () => {
                // add map polygon
                map.addSource('maine', {
                    type: 'geojson',
                    data: {
                        properties: [],
                        type: 'Feature',
                        geometry: data.geojson
                    }
                });

                // Add a new layer to visualize the polygon.
                map.addLayer({
                    id: 'maine',
                    type: 'fill',
                    source: 'maine', // reference the data source
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
                    source: 'maine',
                    layout: {},
                    paint: {
                        'line-color': '#3a3335',
                        'line-width': 1
                    }
                });

                new mapboxgl.Marker(markerRef.current!)
                    .setLngLat([Number(data.lon), Number(data.lat)])
                    .addTo(map);
            });
        }
        // Clean up on unmount
        return () => map?.remove();
    }, [data?.lon, data?.lat, data?.geojson, data?.boundingbox]);

    return (
        <>
            <template>
                <MapPin
                    ref={markerRef}
                    children={
                        <div className="rounded-md bg-white p-2 shadow-md">
                            <House
                                className="h-4 w-4 text-dark"
                                weight="fill"
                            />
                        </div>
                    }
                />
            </template>
            <div className="relative h-[25rem]  bg-primary-15">
                <div ref={mapRef} className={`h-full w-full`} />
            </div>
        </>
    );
}
