import { Property } from './../../entities/Property/Property';
import { CreatePropertyRequest } from './CreatePropertyRequest';
import { FieldErrors } from '../../lib/types';

export type CreatePropertyResponse = {
    errors?: FieldErrors<CreatePropertyRequest>;
    property: Property | null;
};
