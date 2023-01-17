export type AnyCase<T extends string> = string extends T
    ? string
    : T extends `${infer F1}${infer F2}${infer R}`
    ? `${Uppercase<F1> | Lowercase<F1>}${
          | Uppercase<F2>
          | Lowercase<F2>}${AnyCase<R>}`
    : T extends `${infer F}${infer R}`
    ? `${Uppercase<F> | Lowercase<F>}${AnyCase<R>}`
    : '';

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

export type BoundingBox = [number, number, number, number]; // minLat, maxLat, minLong, maxLong
