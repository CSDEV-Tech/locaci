import {
    UpdatePropertyInformationsRequestSchema,
    UpdatePropertyInformationsUseCase,
    UpdatePropertyInformationsPresenter,
    UpdatePropertyInformationsResponse,
    generateMock,
    PropertyRepositoryBuilder,
    RentType,
    Uuid,
    Property
} from '../../src';

import { expect, describe, it } from 'vitest';
import { generateProperty } from '../factories/PropertyFactory';
import { generateUser } from '../factories/UserFactory';

const presenter = new (class implements UpdatePropertyInformationsPresenter {
    response: UpdatePropertyInformationsResponse;

    present(response: UpdatePropertyInformationsResponse): void {
        this.response = response;
    }
})();

const request = generateMock(UpdatePropertyInformationsRequestSchema);

describe('UpdatePropertyInformations Use case', () => {
    it('update the property successfully', async () => {
        let expectedProperty: Property | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    id: new Uuid(request.propertyId),
                    rentType: RentType.LOCATION,
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    })
                })
            )
            .withSave(async p => {
                expectedProperty = p;
            })
            .build();

        const useCase = new UpdatePropertyInformationsUseCase(
            propertyRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).toBeFalsy();
        expect(expectedProperty!.address).toBe(request.address);
    });

    it('Should show error if property does not exists', async () => {
        // Given
        let expectedProperty: Property | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => null)
            .withSave(async p => {
                expectedProperty = p;
            })
            .build();

        const useCase = new UpdatePropertyInformationsUseCase(
            propertyRepository
        );

        // When
        await useCase.execute(request, presenter);

        console.log(presenter.response.errors);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBeFalsy();
        expect(presenter.response?.errors?.propertyId).toHaveLength(1);
        expect(expectedProperty).toBeNull();
    });

    it('Should show error if the user is not the owner of the property', async () => {
        // Given
        let expectedProperty: Property | null = null;

        // Given
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    id: new Uuid(request.propertyId),
                    rentType: RentType.LOCATION,
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    })
                })
            )
            .withSave(async p => {
                expectedProperty = p;
            })
            .build();

        const useCase = new UpdatePropertyInformationsUseCase(
            propertyRepository
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
        expect(expectedProperty).toBeNull();
    });
});
