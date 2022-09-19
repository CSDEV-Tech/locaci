import { AmenityTypes } from './../../src/entities/Amenity';
import { Amenity, randomItemInArray, Uuid } from '../../src';
import { faker } from '@faker-js/faker';

export function generateAmenity(defaultValue?: Partial<Amenity>): Amenity {
    return {
        id: new Uuid(),
        name: faker.lorem.word(),
        type: randomItemInArray(AmenityTypes),
        ...defaultValue
    };
}
