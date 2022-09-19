import { Listing, RentType, Uuid } from '../../src';
import { generateProperty } from './PropertyFactory';
import { faker } from '@faker-js/faker';

export function generateListing(defaultValue?: Partial<Listing>): Listing {
    return {
        id: new Uuid(),
        property: generateProperty({
            rentType: RentType.LOCATION
        }),
        active: true,
        description: faker.lorem.paragraph(),
        availableFrom: faker.date.soon(5),
        housingFee: faker.datatype.number({
            min: 5_000,
            max: 150_000
        }),
        housingPeriod: 30,
        noOfFreeBedRooms: 1,
        cautionMonthsPaymentAdvance: 1,
        agencyMonthsPaymentAdvance: 1,
        ...defaultValue
    };
}
