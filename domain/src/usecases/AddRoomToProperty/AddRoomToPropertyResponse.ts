import { AddRoomToPropertyRequest } from './AddRoomToPropertyRequest';
import { FieldErrors } from '../../lib/types';

export type AddRoomToPropertyResponse = {
    errors?: FieldErrors<AddRoomToPropertyRequest>;
};
