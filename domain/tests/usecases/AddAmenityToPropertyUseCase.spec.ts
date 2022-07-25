import { expect, describe, it } from 'vitest';
import { AmenityRepositoryBuilder } from './../builder/AmenityRepositoryBuilder';
import {
    AddAmenityToPropertyRequestSchema,
    AddAmenityToPropertyUseCase,
    AddAmenityToPropertyPresenter,
    AddAmenityToPropertyResponse,
    generateMock,
    Property,
    RentType,
    Amenity,
    randomItemInArray,
    Uuid
} from '../../src';

import { PropertyRepositoryBuilder } from '../builder/PropertyRepositoryBuilder';
import { generateProperty } from '../factories/PropertyFactory';
import { generateUser } from '../factories/UserFactory';

const presenter = new (class implements AddAmenityToPropertyPresenter {
    response: AddAmenityToPropertyResponse;

    present(response: AddAmenityToPropertyResponse): void {
        this.response = response;
    }
})();

const request = generateMock(AddAmenityToPropertyRequestSchema);

describe('AddAmenityToProperty Use case', () => {
    it('adds the amenity to the property', async () => {
        // Given
        let property: Property | null = null;
        let newAmenity: Amenity | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    rentType: RentType.SHORT_TERM,
                    owner: generateUser({
                        id: request.userId
                    })
                })
            )
            .withSave(async p => {
                property = p;
            })
            .build();
        const amenityRepository = new AmenityRepositoryBuilder()
            .withSave(async a => {
                newAmenity = a;
            })
            .build();

        const useCase = new AddAmenityToPropertyUseCase(
            propertyRepository,
            amenityRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(property).not.toBe(null);
        expect(newAmenity).not.toBe(null);
        expect(property!.amenities).toHaveLength(1);
    });

    it('Should show error if rent-type of property is not SHORT_TERM', async () => {
        // Given
        let property: Property | null = null;
        let newAmenity: Amenity | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    rentType: randomItemInArray([
                        RentType.COLOCATION,
                        RentType.LOCATION
                    ]),
                    owner: generateUser({
                        id: request.userId
                    })
                })
            )
            .withSave(async p => {
                property = p;
            })
            .build();
        const amenityRepository = new AmenityRepositoryBuilder()
            .withSave(async a => {
                newAmenity = a;
            })
            .build();

        const useCase = new AddAmenityToPropertyUseCase(
            propertyRepository,
            amenityRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.propertyId).toHaveLength(1);
        expect(property).toBe(null);
        expect(newAmenity).toBe(null);
    });

    it('Should show error if property does not exists', async () => {
        let newAmenity: Amenity | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => null)
            .build();

        const amenityRepository = new AmenityRepositoryBuilder()
            .withSave(async a => {
                newAmenity = a;
            })
            .build();

        const useCase = new AddAmenityToPropertyUseCase(
            propertyRepository,
            amenityRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.propertyId).toHaveLength(1);
        expect(newAmenity).toBe(null);
    });

    it('Should show error if the user is not the owner of the property', async () => {
        // Given
        let property: Property | null = null;
        let newAmenity: Amenity | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    rentType: RentType.SHORT_TERM
                })
            )
            .withSave(async p => {
                property = p;
            })
            .build();
        const amenityRepository = new AmenityRepositoryBuilder()
            .withSave(async a => {
                newAmenity = a;
            })
            .build();

        const useCase = new AddAmenityToPropertyUseCase(
            propertyRepository,
            amenityRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                userId: new Uuid().toString()
            },
            presenter
        );

        console.log(presenter.response.errors);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.userId).toHaveLength(1);
        expect(property).toBeNull();
        expect(newAmenity).toBeNull();
    });
});
