export type Amenity = {
    id: string;
    name?: string;
    type: AmenityType;
};

export enum AmenityType {
    WIFI = 'WIFI',
    CABLE = 'CABLE',
    HOT_WATER = 'HOT_WATER',
    TWIN_BED = 'TWIN_BED',
    RADIATOR = 'RADIATOR',
    OTHER = 'OTHER'
}

export const AmenityTypes = Object.values(AmenityType);
