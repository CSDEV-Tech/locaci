import { Rental, RentalRepository } from '.';

export class RentalRepositoryBuilder {
    private save: (entity: Rental) => Promise<Rental> = (entity: Rental) =>
        Promise.resolve(entity);
    private getRentalById: (id: string) => Promise<Rental | null> = () =>
        Promise.resolve(null);
    private getActiveOrReservedRentalsForListing: (
        listingId: string
    ) => Promise<Rental[]> = () => Promise.resolve([]);

    private getActiveOrReservedRentalsForProperty: (
        propertyId: string
    ) => Promise<Rental[]> = () => Promise.resolve([]);

    withSave(save: (entity: Rental) => Promise<Rental>) {
        this.save = save;
        return this;
    }

    withGetActiveOrReservedRentalsForListing(
        getActiveOrReservedRentalsForListing: (
            listingId: string
        ) => Promise<Rental[]>
    ) {
        this.getActiveOrReservedRentalsForListing =
            getActiveOrReservedRentalsForListing;
        return this;
    }

    withGetActiveOrReservedRentalsForProperty(
        getActiveOrReservedRentalsForProperty: (
            propertyId: string
        ) => Promise<Rental[]>
    ) {
        this.getActiveOrReservedRentalsForProperty =
            getActiveOrReservedRentalsForProperty;
        return this;
    }

    withGetRentalById(getRentalById: (id: string) => Promise<Rental | null>) {
        this.getRentalById = getRentalById;
        return this;
    }

    build(): RentalRepository {
        return {
            save: this.save,
            getRentalById: this.getRentalById,
            getActiveOrReservedRentalsForListing:
                this.getActiveOrReservedRentalsForListing,
            getActiveOrReservedRentalsForProperty:
                this.getActiveOrReservedRentalsForProperty
        };
    }
}
