'use client';
import * as React from 'react';

// utils
import * as L from 'leaflet';
import { renderToString } from 'react-dom/server';

// types
import type { BoundingBox, GeoJSON } from '~/lib/types';
import { env } from '~/env/client.mjs';
import { clsx } from '@locaci/ui/lib/functions';

export type Marker = {
    id: string;
    center: L.LatLngTuple;
    geojson?: GeoJSON;
} & Record<string, any>;

export type MarkerProps = {
    id: string;
    baseId: string;
} & Record<string, any>;

export type MapProps = {
    className?: string;
    markers: Marker[];
    boundingbox: BoundingBox;
    markerComponent: React.ComponentType<MarkerProps>;
    onMarkersLoaded?: () => () => void;
    onMove?: (new_bbox: L.LatLngBounds) => void;
};

export default function Map(props: MapProps) {
    const mapRef = React.useRef<HTMLDivElement>(null);

    const [map, setMap] = React.useState<L.Map | null>();
    const baseId = React.useId();

    React.useEffect(() => {
        if (!mapRef.current) return;

        const bounds = L.latLngBounds(
            L.latLng(props.boundingbox[1], props.boundingbox[0]), // minLat, minLong
            L.latLng(props.boundingbox[3], props.boundingbox[2]) // maxLat, maxLong
        );
        const map = L.map(mapRef.current).fitBounds(bounds);

        L.tileLayer(
            `https://api.mapbox.com/styles/v1/fredkiss3/cky7kyfcw6ydq15l1reh6b92j/tiles/256/{z}/{x}/{y}@2x?access_token=${env.NEXT_PUBLIC_MAPBOX_KEY}`,
            {
                maxZoom: 32,
                attribution:
                    '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
        ).addTo(map);

        map.on('zoomend', () => {
            props.onMove?.(map.getBounds());
        });

        map.on('mouseup', () => {
            props.onMove?.(map.getBounds());
        });

        setMap(map);

        return () => {
            map?.remove();
        };
    }, []);

    React.useEffect(() => {
        if (!map) return;
        const popups: L.Popup[] = [];
        const geojsons: L.GeoJSON[] = [];

        for (const marker of props.markers) {
            const { id, geojson, center, ...otherProps } = marker;

            if (geojson && geojson.type !== 'Point') {
                const geo = L.geoJSON(geojson, {
                    style: {
                        color: '#3a3335'
                    }
                }).addTo(map);
                geojsons.push(geo);
            }

            const popup = L.popup({
                autoClose: false,
                closeOnEscapeKey: false,
                closeOnClick: false,
                closeButton: false
            })
                .setLatLng(center)
                .setContent(
                    renderToString(
                        <props.markerComponent
                            baseId={baseId}
                            id={id}
                            {...otherProps}
                        />
                    )
                );
            popup.addTo(map);
            popups.push(popup);
        }

        const clearListeners = props.onMarkersLoaded?.();
        return () => {
            popups.forEach(p => p.remove());
            geojsons.forEach(g => g.remove());
            clearListeners?.();
        };
    }, [map, props.markers]);

    return (
        <>
            <div
                ref={mapRef}
                className={clsx(props.className, `z-10 h-full w-full`)}
            />
        </>
    );
}
