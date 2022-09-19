import { Property, Role, RoomType, Uuid } from '../../src';
import { randomItemInArray, RentTypes } from '../../src';
import { generateUser } from './UserFactory';
import { faker } from '@faker-js/faker';

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
            latitude: Number(faker.address.latitude())
        },
        boundingBox: [
            {
                longitude: Number(faker.address.longitude()),
                latitude: Number(faker.address.latitude())
            },
            {
                longitude: Number(faker.address.longitude()),
                latitude: Number(faker.address.latitude())
            }
        ],
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
        archived: false,
        ...defaultValue
    };
}
