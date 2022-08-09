import { UpdatePropertyInformationsRequest } from './UpdatePropertyInformationsRequest';
import { FieldErrors } from '../../lib/types';

export type UpdatePropertyInformationsResponse = {
    errors?: FieldErrors<UpdatePropertyInformationsRequest>;
    // TODO: Response args
};
