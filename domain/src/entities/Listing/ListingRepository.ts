import { Listing } from './';

export interface ListingRepository {
    getListingById(id: string): Promise<Listing | null>;
    getActiveListingsForProperty(propertyId: string): Promise<Listing[]>;
    deleteActiveListingsForProperty(propertyId: string): Promise<void>;
    save(listing: Listing): Promise<void>;
}
