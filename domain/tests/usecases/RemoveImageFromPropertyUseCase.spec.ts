import {
    RemoveImageFromPropertyRequestSchema,
    RemoveImageFromPropertyUseCase,
    RemoveImageFromPropertyPresenter,
    RemoveImageFromPropertyResponse,
    generateMock,
    PropertyRepositoryBuilder,
    Uuid,
    Property,
    ImageRepositoryBuilder
} from '../../src';

import { expect, describe, it } from 'vitest';
import { generateProperty } from '../factories/PropertyFactory';
import { generateUser } from '../factories/UserFactory';

const presenter = new (class implements RemoveImageFromPropertyPresenter {
    response: RemoveImageFromPropertyResponse;

    present(response: RemoveImageFromPropertyResponse): void {
        this.response = response;
    }
})();

const request = generateMock(RemoveImageFromPropertyRequestSchema);

describe('RemoveImageFromProperty Use case', () => {
    it('removes the image from the property', async () => {
        // Given
        let property: Property | null = null;
        let deletedImageId: string | null = null;
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    }),
                    images: [
                        {
                            id: new Uuid(request.imageId),
                            path: 'path'
                        },
                        {
                            id: new Uuid(),
                            path: 'path-2'
                        }
                    ]
                })
            )
            .withSave(async p => {
                property = p;
            })
            .build();

        const imageRepository = new ImageRepositoryBuilder()
            .withDeleteImage(async id => {
                deletedImageId = id;
            })
            .build();
        const useCase = new RemoveImageFromPropertyUseCase(
            propertyRepository,
            imageRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(property).not.toBe(null);
        expect(deletedImageId).not.toBe(null);
        expect(property!.images).toHaveLength(1);
    });

    it('should show error if the image is not included in the property', async () => {
        // Given
        let property: Property | null = null;
        const generatedProperty = generateProperty({
            owner: generateUser({
                id: new Uuid(request.userId)
            }),
            images: [
                {
                    id: new Uuid(),
                    path: 'path'
                },
                {
                    id: new Uuid(),
                    path: 'path-2'
                }
            ]
        });
        let deletedImageId: string | null = null;
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generatedProperty)
            .withSave(async p => {
                property = p;
            })
            .build();
        const imageRepository = new ImageRepositoryBuilder()
            .withDeleteImage(async id => {
                deletedImageId = id;
            })
            .build();
        const useCase = new RemoveImageFromPropertyUseCase(
            propertyRepository,
            imageRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.errors?.imageId).toHaveLength(1);
        expect(property).toBe(null);
        expect(deletedImageId).toBe(null);
        expect(generatedProperty.images).toHaveLength(2);
    });

    it('Should show error if property does not exists', async () => {
        // Given
        let property: Property | null = null;

        const imageRepository = new ImageRepositoryBuilder().build();
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => null)
            .build();

        const useCase = new RemoveImageFromPropertyUseCase(
            propertyRepository,
            imageRepository
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
        let deletedImageId: string | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generateProperty())
            .withSave(async p => {
                property = p;
            })
            .build();
        const imageRepository = new ImageRepositoryBuilder()
            .withDeleteImage(async id => {
                deletedImageId = id;
            })
            .build();

        const useCase = new RemoveImageFromPropertyUseCase(
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
        expect(deletedImageId).toBeNull();
    });
});
