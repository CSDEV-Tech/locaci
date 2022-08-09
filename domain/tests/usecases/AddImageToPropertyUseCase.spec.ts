import {
    AddImageToPropertyRequestSchema,
    AddImageToPropertyUseCase,
    AddImageToPropertyPresenter,
    AddImageToPropertyResponse,
    generateMock,
    Property,
    PropertyRepositoryBuilder,
    ImageRepositoryBuilder,
    Image,
    Uuid
} from '../../src';

import { expect, describe, it } from 'vitest';
import { generateProperty } from '../factories/PropertyFactory';
import { generateUser } from '../factories/UserFactory';

const presenter = new (class implements AddImageToPropertyPresenter {
    response: AddImageToPropertyResponse;

    present(response: AddImageToPropertyResponse): void {
        this.response = response;
    }
})();

const request = generateMock(AddImageToPropertyRequestSchema, {
    // TODO: overrides
});

describe('AddImageToProperty Use case', () => {
    it('adds the new image to the property', async () => {
        // Given
        let property: Property | null = null;
        let newImage: Image | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    owner: generateUser({
                        id: request.userId
                    }),
                    images: []
                })
            )
            .withSave(async p => {
                property = p;
            })
            .build();

        const imageRepository = new ImageRepositoryBuilder()
            .withSave(async image => {
                newImage = image;
            })
            .build();

        const useCase = new AddImageToPropertyUseCase(
            propertyRepository,
            imageRepository
        );

        // When
        await useCase.execute(request, presenter);
        console.log(request);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(property).not.toBe(null);
        expect(newImage).not.toBe(null);
        expect(property!.images).toHaveLength(1);
    });

    it('Should show error if property does not exists', async () => {
        // Given
        let property: Property | null = null;

        const roomRepository = new ImageRepositoryBuilder().build();
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => null)
            .build();

        const useCase = new AddImageToPropertyUseCase(
            propertyRepository,
            roomRepository
        );

        // When
        await useCase.execute(request, presenter);

        console.log(presenter.response.errors);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBeFalsy();
        expect(presenter.response?.errors?.propertyId).toHaveLength(1);
        expect(property).toBeNull();
    });

    it('Should show error if the user is not the owner of the property', async () => {
        // Given
        let property: Property | null = null;
        let newImage: Image | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generateProperty())
            .withSave(async p => {
                property = p;
            })
            .build();
        const imageRepository = new ImageRepositoryBuilder()
            .withSave(async image => {
                newImage = image;
            })
            .build();

        const useCase = new AddImageToPropertyUseCase(
            propertyRepository,
            imageRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                userId: new Uuid().toString()
            },
            presenter
        );

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBeFalsy();
        expect(presenter.response?.errors?.userId).toHaveLength(1);
        expect(property).toBeNull();
        expect(newImage).toBeNull();
    });
});
