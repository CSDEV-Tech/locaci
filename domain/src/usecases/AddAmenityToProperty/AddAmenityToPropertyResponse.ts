import { AddAmenityToPropertyRequest } from './AddAmenityToPropertyRequest';
import { FieldErrors } from '../../lib/types';
import { Amenity } from './../../entities/Amenity';

export type AddAmenityToPropertyResponse = {
    errors?: FieldErrors<AddAmenityToPropertyRequest>;
    amenity: Amenity | null;
};
