import { Room } from './../Room/Room';
import { Image } from '../../Dto';
import { User } from '../User';

export type Property = {
    id: string;
    position: Position;
    rentType: RentType;
    images: Image[];
    // en mètres carrés
    surfaceArea: number;
    commune: string;
    district: string;
    city: string;
    address?: string;
    owner: User;
    rooms: Room[];
    noOfRooms: number;
};

export type Position = {
    longitude: number;
    latitude: number;
    // rayon autour de la position en Km
    radius: number;
};

export enum RentType {
    LOCATION = 'LOCATION',
    COLOCATION = 'COLOCATION',
    SHORT_TERM = 'SHORT_TERM'
}

export const RentTypes = Object.values(RentType);
