import { UpdateListingRequest } from './UpdateListingRequest';
import { FieldErrors } from '../../lib/types';

export type UpdateListingResponse = {
    errors?: FieldErrors<UpdateListingRequest>;
};
