import { Property, range, Role, RoomType } from '../../src';
import { randomItemInArray, RentTypes } from '../../src';
import { generateUser } from './UserFactory';
import faker from '@faker-js/faker';

export function generateProperty(defaultValue?: Partial<Property>): Property {
    return {
        id: faker.datatype.uuid(),
        noOfRooms: 1,
        rooms: [
            {
                id: faker.datatype.uuid(),
                type: RoomType.BEDROOM
            }
        ],
        position: {
            longitude: Number(faker.address.longitude()),
            latitude: Number(faker.address.latitude()),
            radius: faker.datatype.number({
                min: 0.5,
                max: 10
            })
        },
        rentType: randomItemInArray(RentTypes),
        images: range(
            0,
            faker.datatype.number({
                min: 1,
                max: 10
            })
        ).map(() => ({
            path: faker.image.imageUrl()
        })),
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
