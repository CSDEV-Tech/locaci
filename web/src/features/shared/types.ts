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
