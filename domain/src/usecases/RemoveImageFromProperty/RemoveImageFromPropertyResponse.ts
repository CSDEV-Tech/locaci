import { RemoveImageFromPropertyRequest } from './RemoveImageFromPropertyRequest';
import { FieldErrors } from '../../lib/types';

export type RemoveImageFromPropertyResponse = {
    errors?: FieldErrors<RemoveImageFromPropertyRequest>;
};
