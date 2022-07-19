export type Room = {
    id: string;
    type: RoomType;
};

export enum RoomType {
    BEDROOM = 'BEDROOM',
    LIVING_ROOM = 'LIVING_ROOM',
    KITCHEN = 'KITCHEN',
    BATHROOM = 'BATHROOM',
    LAUDRY = 'LAUDRY',
    ATTIC = 'ATTIC',
    BASEMENT = 'BASEMENT',
    DINING_ROOM = 'DINING_ROOM',
    GARAGE = 'GARAGE',
    BALCONY = 'BALCONY',
    VERANDA = 'VERANDA',
    TERRACE = 'TERRACE'
}

export const RoomTypes = Object.values(RoomType);
