import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~/server/trpc/router';

export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type PointGeoJSON = {
    type: 'Point';
    coordinates: [number, number]; // longitude, latitude
};

export type PolygonGeoJSON = {
    type: 'Polygon';
    coordinates: [Array<[number, number]>];
};

export type GeoJSON = PointGeoJSON | PolygonGeoJSON;

export type OSMResultData = {
    osm_id: number;
    place_id: number;
    type: string;
    category: string;
    class: string;
    boundingbox: BoundingBox;
    lat: string;
    lon: string;
    display_name: string;
    geojson: GeoJSON;
    address: {
        town: string;
        municipality: string;
        neighbourhood: string;
        residential: string;
        industrial: string;
        village: string;
        leisure: string;
        city: string; // city (ex: Abidjan/Bouaké)
        state: string; // state (ex: Abidjan)
    };
};

export type OSMDetailResultData = Omit<
    OSMResultData,
    'geojson' | 'lat' | 'lon' | 'display_name' | 'boundingbox'
> & {
    localname: string;
    geometry: GeoJSON;
    centroid: PointGeoJSON;
};

export type BoundingBox = [number, number, number, number]; // min Longitude, min Latitude, max Longitude, max Latitude

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
