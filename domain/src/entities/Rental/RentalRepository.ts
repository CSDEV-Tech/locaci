import { Rental } from './';

export interface RentalRepository {
    getRentalById(id: string): Promise<Rental | null>;
    save(entity: Rental): Promise<Rental>;
    getActiveOrReservedRentalsForListing(listingId: string): Promise<Rental[]>;
    getActiveOrReservedRentalsForProperty(
        propertyId: string
    ): Promise<Rental[]>;
}
