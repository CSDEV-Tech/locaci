import { AddListingForPropertyRequest } from './AddListingForPropertyRequest';
import { FieldErrors } from '../../lib/types';
import { Listing } from '../../entities/Listing';

export type AddListingForPropertyResponse = {
    errors?: FieldErrors<AddListingForPropertyRequest>;
    newListing: Listing | null;
};
