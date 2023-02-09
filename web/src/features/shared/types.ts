// rentType
export type RentType = 'LOCATION' | 'SHARED_APPARTMENT' | 'SHORT_TERM';

export const RentTypes: Record<RentType, string> = {
    LOCATION: 'Appartement non meublé',
    SHARED_APPARTMENT: 'Appartement en colocation',
    SHORT_TERM: 'Location court-séjour (meublée)'
} as const;

export const RentTypesArray = [
    'LOCATION',
    'SHARED_APPARTMENT',
    'SHORT_TERM'
] as const satisfies readonly RentType[];

// ROLES
export type Role = 'HOUSING_APPLICANT' | 'PROPERTY_OWNER' | 'ADMIN';

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

export const RoomTypesArray = [
    'BEDROOM',
    'LIVING_ROOM',
    'KITCHEN',
    'BATHROOM',
    'LAUNDRY',
    'ATTIC',
    'BASEMENT',
    'DINING_ROOM',
    'GARAGE',
    'BALCONY',
    'VERANDA',
    'TERRACE',
    'TOILET'
] as const satisfies readonly RoomType[];

// amenities
export type AmenityType =
    | 'WIFI'
    | 'CABLE'
    | 'HOT_WATER'
    | 'WASHING_MACHINE'
    | 'DRYER_MACHINE'
    | 'DESKTOP'
    | 'HEATING'
    | 'AIR_CONDITIONNER'
    | 'REFREGIRATOR'
    | 'OVEN'
    | 'MICROWAVE'
    | 'OTHER';

export type PredefinedAmenityTypes = Exclude<AmenityType, 'OTHER'>;

export const AmenityTypes: Record<PredefinedAmenityTypes, string> = {
    HOT_WATER: 'Eau chaude',
    HEATING: 'Chauffage',
    WIFI: 'Wi-fi ou Fibre Optique',
    WASHING_MACHINE: 'Machine à laver',
    DRYER_MACHINE: 'Machine à sécher',
    DESKTOP: 'Bureau de travail',
    CABLE: 'TV Satellite (ex: Canal +)',
    AIR_CONDITIONNER: 'Climatisation',
    OVEN: 'Four',
    MICROWAVE: 'Micro-ondes',
    REFREGIRATOR: 'Réfrégirateur'
} as const;

export const AmenityTypesArray = [
    'WIFI',
    'CABLE',
    'HOT_WATER',
    'WASHING_MACHINE',
    'DRYER_MACHINE',
    'DESKTOP',
    'HEATING',
    'AIR_CONDITIONNER',
    'REFREGIRATOR',
    'OVEN',
    'MICROWAVE'
] as const satisfies readonly PredefinedAmenityTypes[];

// listing Image
export type ListingImage = {
    uri: string;
    name: string;
};
