import { Room } from './../Room/Room';
import { Uuid } from '../../Dto';
import { User } from '../User';
import { Amenity } from '../Amenity';
import { Image } from '../Image';

export type Property = {
    id: Uuid;
    position: Position;
    rentType: RentType;
    // In square meters
    surfaceArea: number;
    commune: string;
    district: string;
    city: string;
    address: string | null;
    owner: User;
    noOfRooms: number;
    images: Image[];
    rooms: Room[];
    amenities: Amenity[];
    archived: boolean;
    // boundingBox with [min position & max position]
    boundingBox: [Position, Position];
};

export type Position = {
    longitude: number;
    latitude: number;
};

export enum RentType {
    LOCATION = 'LOCATION',
    SHARED_APPARTMENT = 'SHARED_APPARTMENT',
    SHORT_TERM = 'SHORT_TERM'
}

export const RentTypes = Object.values(RentType);
