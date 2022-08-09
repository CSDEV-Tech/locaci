import { Property, range, Role, RoomType, Uuid } from '../../src';
import { randomItemInArray, RentTypes } from '../../src';
import { generateUser } from './UserFactory';
import faker from '@faker-js/faker';

export function generateProperty(defaultValue?: Partial<Property>): Property {
    return {
        id: new Uuid(),
        noOfRooms: 1,
        rooms: [
            {
                id: new Uuid(),
                type: RoomType.BEDROOM
            }
        ],
        amenities: [],
        position: {
            longitude: Number(faker.address.longitude()),
            latitude: Number(faker.address.latitude()),
            radius: faker.datatype.number({
                min: 0.5,
                max: 10
            })
        },
        rentType: randomItemInArray(RentTypes),
        images: [],
        surfaceArea: faker.datatype.number({
            min: 6,
            max: 100
        }),
        commune: faker.address.state(),
        district: faker.address.cityName(),
        city: faker.address.city(),
        address: faker.address.streetAddress(true),
        owner: generateUser({
            role: Role.PROPERTY_OWNER
        }),
        ...defaultValue
    };
}
