// rentType
export type RentType = 'LOCATION' | 'SHARED_APPARTMENT' | 'SHORT_TERM';

export const RentTypes: Record<RentType, string> = {
    LOCATION: 'Appartement non meublé',
    SHARED_APPARTMENT: 'Appartement en colocation',
    SHORT_TERM: 'Location court-séjour (meublée)'
};

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
    | 'OTHER'
    | 'RADIATOR';

export type PredefinedAmenityTypes = Exclude<AmenityType, 'OTHER'>;

export const AmenityTypes: Record<PredefinedAmenityTypes, string> = {
    HOT_WATER: 'Eau chaude',
    RADIATOR: 'Climatisation ou Radiateur',
    WIFI: 'Wi-fi ou Fibre Optique',
    TWIN_BED: 'Double lit ou Lit supperposé',
    CABLE: 'TV Satellite (ex: Canal +)'
} as const;
