// rooms
export type RoomType =
    | 'BEDROOM'
    | 'LIVING_ROOM'
    | 'KITCHEN'
    | 'BATHROOM'
    | 'LAUNDRY'
    | 'ATTIC'
    | 'BASEMENT'
    | 'DINING_ROOM'
    | 'GARAGE'
    | 'BALCONY'
    | 'VERANDA'
    | 'TOILET'
    | 'TERRACE';

export const RoomTypes: Record<RoomType, string> = {
    BEDROOM: 'Chambre',
    LIVING_ROOM: 'Salle de vie',
    KITCHEN: 'Cuisine',
    BATHROOM: 'Salle de bain',
    LAUNDRY: 'Buanderie',
    ATTIC: 'Grenier',
    BASEMENT: 'Sous-sol',
    DINING_ROOM: 'Salle à manger',
    GARAGE: 'Garage',
    BALCONY: 'Balcon',
    VERANDA: 'Véranda',
    TERRACE: 'Terasse',
    TOILET: 'Toilette'
} as const;

// amenities
export type AmenityType =
    | 'HOT_WATER'
    | 'CABLE'
    | 'WIFI'
    | 'TWIN_BED'
    | 'RADIATOR';

export const AmenityTypes: Record<AmenityType, string> = {
    HOT_WATER: 'Eau chaude',
    RADIATOR: 'Climatisation',
    WIFI: 'Wi-fi ou Fibre Optique',
    TWIN_BED: 'Double lit ou Lit supperposé',
    CABLE: 'TV Satellite (ex: Canal +)',
} as const;
