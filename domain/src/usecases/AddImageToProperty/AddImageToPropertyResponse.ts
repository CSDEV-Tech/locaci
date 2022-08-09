import { AddImageToPropertyRequest } from './AddImageToPropertyRequest';
import { FieldErrors } from '../../lib/types';

export type AddImageToPropertyResponse = {
    errors?: FieldErrors<AddImageToPropertyRequest>;
    // TODO: Response args
};
