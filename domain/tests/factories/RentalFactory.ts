import {
    randomItemInArray,
    Rental,
    Uuid,
    RentalStatuses,
    Role
} from '../../src';
import { generateListing } from './ListingFactory';
import { generateUser } from './UserFactory';

export function generateRental(defaultValue?: Partial<Rental>): Rental {
    return {
        id: new Uuid(),
        startDate: null,
        endDate: null,
        finalPrice: null,
        status: randomItemInArray(RentalStatuses),
        listing: generateListing(),
        applicant: generateUser({
            role: Role.HOUSING_APPLICANT
        }),
        ...defaultValue
    };
}
