import { generateProperty } from './../factories/PropertyFactory';
import { generateListing } from './../factories/ListingFactory';

import {
    AddListingForPropertyRequestSchema,
    AddListingForPropertyUseCase,
    AddListingForPropertyPresenter,
    AddListingForPropertyResponse,
    generateMock,
    Listing,
    RentType,
    randomItemInArray,
    ListingRepositoryBuilder,
    PropertyRepositoryBuilder,
    Uuid,
    RoomType
} from '../../src';

import { expect, describe, it } from 'vitest';
import { generateUser } from '../factories/UserFactory';

const presenter = new (class implements AddListingForPropertyPresenter {
    response: AddListingForPropertyResponse;

    present(response: AddListingForPropertyResponse): void {
        this.response = response;
    }
})();

const request = generateMock(AddListingForPropertyRequestSchema, {
    noOfFreeBedRooms: 1,
    housingPeriod: 25,
    cautionMonthsPaymentAdvance: 0,
    agencyMonthsPaymentAdvance: 0
});

describe('AddListingForProperty Use case', () => {
    it('adds the listing to the property', async () => {
        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    rentType: RentType.LOCATION,
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    })
                })
            )
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const useCase = new AddListingForPropertyUseCase(
            propertyRepository,
            listingRepository
        );

        // When
        await useCase.execute(request, presenter);

        console.dir(listing, { depth: null });

        // Then
        expect(presenter.response.errors).toBeFalsy();
        expect(listing).not.toBeNull();
        expect(presenter.response.newListing).not.toBeNull();
        expect(presenter.response.newListing?.active).toBe(true);
    });

    it('can only specify the number of free rooms if the property is of type COLOCATION', async () => {
        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    rentType: RentType.COLOCATION,
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    })
                })
            )
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const useCase = new AddListingForPropertyUseCase(
            propertyRepository,
            listingRepository
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
        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    rentType: randomItemInArray([
                        RentType.LOCATION,
                        RentType.SHORT_TERM
                    ]),
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    })
                })
            )
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const useCase = new AddListingForPropertyUseCase(
            propertyRepository,
            listingRepository
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

    it('cannot add more bedrooms to a colocation than the total of bedrooms in property', async () => {
        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    }),
                    rentType: RentType.COLOCATION,
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
                })
            )
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const useCase = new AddListingForPropertyUseCase(
            propertyRepository,
            listingRepository
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

    it('Should set the housing Period to 30 days in case of COLOCATION OR LOCATION if it is not provided in the request', async () => {
        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    }),
                    rentType: randomItemInArray([
                        RentType.LOCATION,
                        RentType.COLOCATION
                    ])
                })
            )
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const useCase = new AddListingForPropertyUseCase(
            propertyRepository,
            listingRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                housingPeriod: undefined
            },
            presenter
        );

        console.dir(listing);

        // Then
        expect(presenter.response.errors).toBeFalsy();
        expect(listing).not.toBeNull();
        expect(listing!.housingPeriod).toBe(30);
    });

    it('Should set the housing Period to 1 day in case of SHORT_TERM if it is not provided in the request', async () => {
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
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const useCase = new AddListingForPropertyUseCase(
            propertyRepository,
            listingRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                housingPeriod: undefined
            },
            presenter
        );

        console.dir(listing);

        // Then
        expect(presenter.response.errors).toBeFalsy();
        expect(listing).not.toBeNull();
        expect(listing!.housingPeriod).toBe(1);
    });

    it('Should set the number of agency payment advance to undefined for COLOCATION', async () => {
        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    rentType: RentType.COLOCATION,
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    })
                })
            )
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const useCase = new AddListingForPropertyUseCase(
            propertyRepository,
            listingRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                agencyMonthsPaymentAdvance: 1
            },
            presenter
        );

        console.dir(listing);

        // Then
        expect(presenter.response.errors).toBeFalsy();
        expect(listing).not.toBeNull();
        expect(listing!.agencyMonthsPaymentAdvance).toBeUndefined();
    });

    it('Should set the number of agency payment advance and the number of caution payment advance to undefined for SHORT_TERM', async () => {
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
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const useCase = new AddListingForPropertyUseCase(
            propertyRepository,
            listingRepository
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

        console.dir(listing);

        // Then
        expect(presenter.response.errors).toBeFalsy();
        expect(listing).not.toBeNull();
        expect(listing!.agencyMonthsPaymentAdvance).toBeUndefined();
        expect(listing!.cautionMonthsPaymentAdvance).toBeUndefined();
    });

    it('Should set the number of agency payment advance and the number of caution payment advance to 0 for LOCATION if not provided', async () => {
        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    rentType: RentType.LOCATION,
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    })
                })
            )
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const useCase = new AddListingForPropertyUseCase(
            propertyRepository,
            listingRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                agencyMonthsPaymentAdvance: undefined,
                cautionMonthsPaymentAdvance: undefined
            },
            presenter
        );

        console.dir(listing);

        // Then
        expect(presenter.response.errors).toBeFalsy();
        expect(listing).not.toBeNull();
        expect(listing!.agencyMonthsPaymentAdvance).toBe(0);
        expect(listing!.cautionMonthsPaymentAdvance).toBe(0);
    });

    it('can only have 1 active listing for a property', async () => {
        let listing: Listing | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    rentType: RentType.LOCATION,
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    })
                })
            )
            .build();
        const listingRepository = new ListingRepositoryBuilder()
            .withGetActiveListingsForProperty(async () => [generateListing()])
            .withSave(async newListing => {
                listing = newListing;
            })
            .build();

        const useCase = new AddListingForPropertyUseCase(
            propertyRepository,
            listingRepository
        );

        // When
        await useCase.execute(request, presenter);

        console.dir(listing);

        // Then
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.global).toHaveLength(1);
        expect(listing).toBeNull();
        expect(presenter.response.newListing).toBeNull();
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

        const useCase = new AddListingForPropertyUseCase(
            propertyRepository,
            listingRepository
        );

        // When
        await useCase.execute(request, presenter);

        console.dir(listing);

        // Then
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.propertyId).toHaveLength(1);
        expect(listing).toBeNull();
        expect(presenter.response.newListing).toBeNull();
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

        const useCase = new AddListingForPropertyUseCase(
            propertyRepository,
            listingRepository
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
        expect(presenter.response.newListing).toBeNull();
    });
});
