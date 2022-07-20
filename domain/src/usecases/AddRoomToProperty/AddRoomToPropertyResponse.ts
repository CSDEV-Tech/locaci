import { AddRoomToPropertyRequest } from './AddRoomToPropertyRequest';
import { FieldErrors } from '../../lib/types';
import { Room } from '../../entities/Room';

export type AddRoomToPropertyResponse = {
    errors?: FieldErrors<AddRoomToPropertyRequest>;
    room: Room | null;
};
