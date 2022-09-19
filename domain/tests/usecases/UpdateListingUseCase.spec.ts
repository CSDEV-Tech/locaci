import {
    UpdateListingRequestSchema,
    UpdateListingUseCase,
    UpdateListingPresenter,
    UpdateListingResponse,
    generateMock,
    ListingRepositoryBuilder,
    PropertyRepositoryBuilder,
    RentType,
    Uuid,
    Listing,
    RentalRepositoryBuilder,
    randomItemInArray,
    RoomType
} from '../../src';

import { expect, describe, it } from 'vitest';
import { generateProperty } from '../factories/PropertyFactory';
import { generateUser } from '../factories/UserFactory';
import { generateListing } from '../factories/ListingFactory';
import { generateRental } from '../factories/RentalFactory';
import { faker } from '@faker-js/faker';

const presenter = new (class implements UpdateListingPresenter {
    response: UpdateListingResponse;

    present(response: UpdateListingResponse): void {
        this.response = response;
    }
})();

const request = generateMock(UpdateListingRequestSchema, {
    description: faker.lorem.sentences()
});

describe('UpdateListing Use case', () => {
    it('can update the listing', async () => {
        let generatedProperty = generateProperty({
            rentType: RentType.LOCATION,
            owner: generateUser({
                id: new Uuid(request.userId)
            })
        });

        let generatedListing = generateListing({
            property: generatedProperty
        });

        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generatedProperty)
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withGetListingById(async id => generatedListing)
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();
        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new UpdateListingUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(request, presenter);

        console.log({ listing });
        // Then
        expect(presenter.response).not.toBe(null);
        expect(listing).not.toBe(null);
    });

    it('cannot update the listing if there is at least one active rental for the listing', async () => {
        let generatedProperty = generateProperty({
            rentType: RentType.LOCATION,
            owner: generateUser({
                id: new Uuid(request.userId)
            })
        });

        let generatedListing = generateListing({
            property: generatedProperty
        });

        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generatedProperty)
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withGetListingById(async id => generatedListing)
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();
        const rentalRepository = new RentalRepositoryBuilder()
            .withGetActiveOrReservedRentalsForListing(async id => [
                generateRental()
            ])
            .build();

        const useCase = new UpdateListingUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(request, presenter);

        console.log({ listing, errors: presenter.response.errors });
        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.listingId).toHaveLength(1);
        expect(listing).toBeNull();
    });

    it('can only specify the number of free rooms if the property is of type COLOCATION', async () => {
        let generatedProperty = generateProperty({
            rentType: RentType.SHARED_APPARTMENT,
            owner: generateUser({
                id: new Uuid(request.userId)
            })
        });

        let generatedListing = generateListing({
            property: generatedProperty
        });

        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generatedProperty)
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withGetListingById(async id => generatedListing)
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();
        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new UpdateListingUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                noOfFreeBedRooms: 1
            },
            presenter
        );

        console.dir(presenter.response.errors);

        // Then
        expect(presenter.response.errors).toBeFalsy();
        expect(listing).not.toBeNull();
        expect(listing!.noOfFreeBedRooms).toBe(1);
    });

    it('cannot specify the number of free rooms if the property is not of type COLOCATION', async () => {
        let generatedProperty = generateProperty({
            rentType: randomItemInArray([
                RentType.LOCATION,
                RentType.SHORT_TERM
            ]),
            owner: generateUser({
                id: new Uuid(request.userId)
            })
        });

        let generatedListing = generateListing({
            property: generatedProperty,
            noOfFreeBedRooms: undefined
        });

        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generatedProperty)
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withGetListingById(async id => generatedListing)
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new UpdateListingUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                noOfFreeBedRooms: 1
            },
            presenter
        );

        console.dir(presenter.response.errors);

        // Then
        expect(presenter.response.errors).toBeFalsy();
        expect(listing).not.toBeNull();
        expect(listing!.noOfFreeBedRooms).toBeUndefined();
    });

    it('cannot specify more bedrooms to a colocation than the total of bedrooms in property', async () => {
        let generatedProperty = generateProperty({
            owner: generateUser({
                id: new Uuid(request.userId)
            }),
            rentType: RentType.SHARED_APPARTMENT,
            rooms: [
                {
                    id: new Uuid(),
                    type: RoomType.BEDROOM
                },
                {
                    id: new Uuid(),
                    type: RoomType.BEDROOM
                },
                {
                    id: new Uuid(),
                    type: RoomType.LIVING_ROOM
                }
            ]
        });

        let generatedListing = generateListing({
            property: generatedProperty
        });

        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generatedProperty)
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withGetListingById(async id => generatedListing)
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new UpdateListingUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                noOfFreeBedRooms: 3
            },
            presenter
        );

        console.dir(listing, { depth: null });

        // Then
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.noOfFreeBedRooms).toHaveLength(1);
        expect(listing).toBeNull();
    });

    it('Should not modify the listing if no data is passed in the request', async () => {
        const generatedProperty = generateProperty({
            owner: generateUser({
                id: new Uuid(request.userId)
            }),
            rentType: randomItemInArray([
                RentType.LOCATION,
                RentType.SHARED_APPARTMENT
            ])
        });

        let generatedListing = generateListing({
            property: generatedProperty
        });

        let listing: Listing | null = null;
        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generatedProperty)
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withGetListingById(async id => generatedListing)
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new UpdateListingUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                housingPeriod: undefined,
                agencyMonthsPaymentAdvance: undefined,
                cautionMonthsPaymentAdvance: undefined,
                availableFrom: undefined,
                description: undefined,
                housingFee: undefined,
                noOfFreeBedRooms: undefined,
                active: undefined
            },
            presenter
        );

        console.dir({ listing });

        // Then
        expect(presenter.response.errors).toBeFalsy();
        expect(listing).not.toBeNull();
        expect(listing!.housingPeriod).not.toBeFalsy();
        expect(listing!.availableFrom).not.toBeFalsy();
        expect(listing!.description).not.toBeFalsy();
        expect(listing!.housingFee).not.toBeFalsy();
        expect(listing!.active).not.toBeUndefined();
    });

    it('Should set the number of agency payment advance to undefined for SHARED_APPARTMENT', async () => {
        let listing: Listing | null = null;
        let generatedProperty = generateProperty({
            rentType: RentType.SHARED_APPARTMENT,
            owner: generateUser({
                id: new Uuid(request.userId)
            })
        });

        let generatedListing = generateListing({
            property: generatedProperty
        });

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generatedProperty)
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withGetListingById(async id => generatedListing)
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new UpdateListingUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                agencyMonthsPaymentAdvance: 1,
                noOfFreeBedRooms: undefined
            },
            presenter
        );

        console.dir({ listing, errors: presenter.response.errors });

        // Then
        expect(presenter.response.errors).toBeFalsy();
        expect(listing).not.toBeNull();
        expect(listing!.agencyMonthsPaymentAdvance).toBeUndefined();
    });

    it('Should set the number of agency payment advance and the number of caution payment advance to undefined for SHORT_TERM', async () => {
        let listing: Listing | null = null;
        let generatedProperty = generateProperty({
            rentType: RentType.SHORT_TERM,
            owner: generateUser({
                id: new Uuid(request.userId)
            })
        });

        let generatedListing = generateListing({
            property: generatedProperty
        });

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generatedProperty)
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withGetListingById(async id => generatedListing)
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();
        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new UpdateListingUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                agencyMonthsPaymentAdvance: 1,
                cautionMonthsPaymentAdvance: 1
            },
            presenter
        );

        console.dir({ listing });

        // Then
        expect(presenter.response.errors).toBeFalsy();
        expect(listing).not.toBeNull();
        expect(listing!.agencyMonthsPaymentAdvance).toBeUndefined();
        expect(listing!.cautionMonthsPaymentAdvance).toBeUndefined();
    });

    it('can close a listing', async () => {
        let listing: Listing | null = null;
        let generatedProperty = generateProperty({
            rentType: RentType.SHORT_TERM,
            owner: generateUser({
                id: new Uuid(request.userId)
            })
        });

        let generatedListing = generateListing({
            property: generatedProperty
        });

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generatedProperty)
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withGetListingById(async id => generatedListing)
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new UpdateListingUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                active: false
            },
            presenter
        );

        console.dir({ listing });

        // Then
        expect(presenter.response.errors).toBeFalsy();
        expect(listing).not.toBeNull();
        expect(listing!.active).toBe(false);
    });

    it('can only have 1 active listing for a property', async () => {
        let listing: Listing | null = null;
        let generatedProperty = generateProperty({
            rentType: RentType.SHORT_TERM,
            owner: generateUser({
                id: new Uuid(request.userId)
            })
        });

        let generatedListing = generateListing({
            property: generatedProperty,
            active: false
        });

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generatedProperty)
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withGetListingById(async id => generatedListing)
            .withGetActiveListingsForProperty(async () => [generateListing()])
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new UpdateListingUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                active: true
            },
            presenter
        );

        console.dir({ errors: presenter.response.errors });

        // Then
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.global).toHaveLength(1);
        expect(listing).toBeNull();
    });

    it('Should show error if property does not exist', async () => {
        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => null)
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();
        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new UpdateListingUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(request, presenter);

        console.dir(listing);

        // Then
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.propertyId).toHaveLength(1);
        expect(listing).toBeNull();
    });

    it('Should show error if listing does not exist', async () => {
        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    rentType: RentType.SHORT_TERM,
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    })
                })
            )
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withGetListingById(async id => null)
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();
        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new UpdateListingUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(request, presenter);

        console.dir(listing);

        // Then
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.listingId).toHaveLength(1);
        expect(listing).toBeNull();
    });

    it('Should show error if the listing does not concern the property', async () => {
        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    rentType: RentType.SHORT_TERM,
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    })
                })
            )
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withGetListingById(async id => generateListing())
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();
        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new UpdateListingUseCase(
            propertyRepository,
            listingRepository,
            rentalRepository
        );

        // When
        await useCase.execute(request, presenter);

        console.dir(listing);

        // Then
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.listingId).toHaveLength(1);
        expect(listing).toBeNull();
    });

    it('Should show error if the user is not the owner of the property', async () => {
        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    rentType: RentType.LOCATION
                })
            )
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const rentalRepository = new RentalRepositoryBuilder().build();

        const useCase = new UpdateListingUseCase(
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

        console.dir(listing, { depth: null });

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.userId).toHaveLength(1);
    });
});
