import { Listing, ListingRepository } from '.';

export class ListingRepositoryBuilder {
    private save: (listing: Listing) => Promise<void> = () => Promise.resolve();
    private getListingById: (id: string) => Promise<Listing | null> = () =>
        Promise.resolve(null);

    private getActiveListingsForProperty: (
        propertyId: string
    ) => Promise<Listing[]> = () => Promise.resolve([]);

    private deleteActiveListingsForProperty: (
        propertyId: string
    ) => Promise<void> = () => Promise.resolve();

    withSave(save: (listing: Listing) => Promise<void>) {
        this.save = save;
        return this;
    }

    withGetListingById(
        getListingById: (id: string) => Promise<Listing | null>
    ) {
        this.getListingById = getListingById;
        return this;
    }

    withGetActiveListingsForProperty(
        getActiveListingsForProperty: (propertyId: string) => Promise<Listing[]>
    ) {
        this.getActiveListingsForProperty = getActiveListingsForProperty;
        return this;
    }

    withDeleteActiveListingsForProperty(
        deleteActiveListingsForProperty: (propertyId: string) => Promise<void>
    ) {
        this.deleteActiveListingsForProperty = deleteActiveListingsForProperty;
        return this;
    }

    build(): ListingRepository {
        return {
            save: this.save,
            getListingById: this.getListingById,
            getActiveListingsForProperty: this.getActiveListingsForProperty,
            deleteActiveListingsForProperty:
                this.deleteActiveListingsForProperty
        };
    }
}
