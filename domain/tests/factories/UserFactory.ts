import { randomItemInArray, User } from '../../src';
import { Roles } from '../../src';
import faker from '@faker-js/faker';

export function generateUser(defaultValue?: Partial<User>): User {
    return {
        id: faker.datatype.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        role: randomItemInArray(Roles),
        email: faker.internet.email(),
        phoneNumber: faker.phone.phoneNumber('0#-##-##-##-##'),
        ...defaultValue
    };
}
