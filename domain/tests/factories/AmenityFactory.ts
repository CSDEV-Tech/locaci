import { AmenityTypes } from './../../src/entities/Amenity';
import { Amenity, randomItemInArray } from '../../src';
import faker from '@faker-js/faker';

export function generateAmenity(defaultValue?: Partial<Amenity>): Amenity {
    return {
        // TODO: generate factory
        id: faker.datatype.uuid(),
        name: faker.lorem.word(),
        type: randomItemInArray(AmenityTypes),
        ...defaultValue
    };
}
