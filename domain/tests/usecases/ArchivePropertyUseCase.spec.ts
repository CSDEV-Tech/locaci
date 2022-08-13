import {
    ArchivePropertyRequestSchema,
    ArchivePropertyUseCase,
    ArchivePropertyPresenter,
    ArchivePropertyResponse,
    generateMock,
    PropertyRepositoryBuilder,
    ListingRepositoryBuilder,
    RentalRepositoryBuilder,
    Uuid,
    Property,
    RentType,
    Listing
} from '../../src';

import { expect, describe, it } from 'vitest';
import { generateProperty } from '../factories/PropertyFactory';
import { generateUser } from '../factories/UserFactory';
import { generateListing } from '../factories/ListingFactory';
import { generateRental } from '../factories/RentalFactory';

const presenter = new (class implements ArchivePropertyPresenter {
    response: ArchivePropertyResponse;

    present(response: ArchivePropertyResponse): void {
        this.response = response;
    }
})();

const request = generateMock(ArchivePropertyRequestSchema, {});

describe('ArchiveProperty Use case', () => {
    it('is archived succesfully', async () => {
        // Given
        let property: Property | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    })
                })
            )
            .withSave(async p => {
                property = p;
            })
            .build();
        const listingRepository = new ListingRepositoryBuilder().build();
        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new ArchivePropertyUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(property).not.toBe(null);
        expect(property!.archived).toBe(true);
    });

    it('delete all the active listings', async () => {
        // Given
        let property: Property | null = null;
        let activeListings = [generateListing()];

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    })
                })
            )
            .withSave(async p => {
                property = p;
            })
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withDeleteActiveListingsForProperty(async id => {
                activeListings = [];
            })
            .build();
        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new ArchivePropertyUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(property).not.toBe(null);
        expect(property!.archived).toBe(true);
        expect(activeListings).toHaveLength(0);
    });

    it('cannot archive the property if there are active or reserved rentals', async () => {
        // Given
        let property: Property | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    })
                })
            )
            .withSave(async p => {
                property = p;
            })
            .build();
        const listingRepository = new ListingRepositoryBuilder().build();
        const rentalRepository = new RentalRepositoryBuilder()
            .withGetActiveOrReservedRentalsForProperty(async p => [
                generateRental()
            ])
            .build();

        const useCase = new ArchivePropertyUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).not.toBe(null);
        expect(presenter.response.errors?.propertyId).toHaveLength(1);
        expect(property).toBeNull();
    });

    it('Should show error if property does not exist', async () => {
        // Given
        let property: Property | null = null;
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => null)
            .withSave(async p => {
                property = p;
            })
            .build();
        const listingRepository = new ListingRepositoryBuilder().build();
        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new ArchivePropertyUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.propertyId).toHaveLength(1);
        expect(property).toBeNull();
    });

    it('Should show error if the user is not the owner of the property', async () => {
        let property: Property | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    rentType: RentType.LOCATION
                })
            )
            .withSave(async p => {
                property = p;
            })
            .build();
        const listingRepository = new ListingRepositoryBuilder().build();

        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new ArchivePropertyUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                userId: new Uuid().toString()
            },
            presenter
        );

        console.dir(property, { depth: null });

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.userId).toHaveLength(1);
        expect(property).toBeNull();
    });
});
