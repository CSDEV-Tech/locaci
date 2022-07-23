import { Listing } from './';

export interface ListingRepository {
    getListingById(id: string): Promise<Listing | null>;
    getActiveListingsForProperty(propertyId: string): Promise<Listing[]>;
    save(listing: Listing): Promise<void>;
}
