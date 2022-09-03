import { RemoveRoomFromPropertyRequest } from './RemoveRoomFromPropertyRequest';
import { FieldErrors } from '../../lib/types';

export type RemoveRoomFromPropertyResponse = {
    errors?: FieldErrors<RemoveRoomFromPropertyRequest>;
};
