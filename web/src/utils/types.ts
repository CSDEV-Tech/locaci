export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type PointGeoJSON = {
    type: 'Point';
    coordinates: [number, number];
};

export type PolygonGeoJSON = {
    type: 'Polygon';
    coordinates: [Array<[number, number]>];
};

export type GeoJSON = PointGeoJSON | PolygonGeoJSON;

export type OSMResultData = {
    osm_id: number;
    type: string;
    boundingbox: [string, string, string, string]; // min lat, max lat, min long, max long
    lat: string;
    lon: string;
    display_name: string;
    geojson: GeoJSON;
    address: {
        municipality: string;
        neighbourhood: string;
        industrial: string;
        village: string;
        city: string; // city (ex: Abidjan/Bouaké)
        state: string; // state (ex: Abidjan)
    };
};
