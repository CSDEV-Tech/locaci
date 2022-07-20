import { RoomType } from './../../src/entities/Room/Room';
import { expect, describe, it } from 'vitest';
import {
    AddRoomToPropertyRequestSchema,
    AddRoomToPropertyUseCase,
    AddRoomToPropertyPresenter,
    AddRoomToPropertyResponse,
    generateMock,
    AddRoomToPropertyRequest,
    randomItemInArray,
    RoomTypes,
    Property
} from '../../src';
import { PropertyRepositoryBuilder } from '../builder/PropertyRepositoryBuilder';
import { generateProperty } from '../factories/PropertyFactory';

const presenter = new (class implements AddRoomToPropertyPresenter {
    response: AddRoomToPropertyResponse;

    present(response: AddRoomToPropertyResponse): void {
        this.response = response;
    }
})();

const request = generateMock(AddRoomToPropertyRequestSchema, {
    roomType: randomItemInArray(RoomTypes)
});

describe('AddRoomToProperty Use case', () => {
    it('it should add the room to the property', async () => {
        // Given
        let property: Property | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generateProperty())
            .withSave(async p => {
                property = p;
            })
            .build();

        const useCase = new AddRoomToPropertyUseCase(propertyRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.room).not.toBe(null);
        expect(presenter.response?.errors).toBeFalsy();
        expect(property).not.toBeNull();
        expect(property!.rooms).toHaveLength(2);
    });

    it('Should update the number of rooms if roomtype is either BEDROOM, KITCHEN, LIVING_ROOM', async () => {
        // Given
        let property: Property | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generateProperty())
            .withSave(async p => {
                property = p;
            })
            .build();

        const useCase = new AddRoomToPropertyUseCase(propertyRepository);

        // When
        await useCase.execute(
            {
                ...request,
                roomType: randomItemInArray([
                    RoomType.BEDROOM,
                    RoomType.LIVING_ROOM,
                    RoomType.KITCHEN
                ])
            },
            presenter
        );

        console.log(property);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).toBeFalsy();
        expect(property).not.toBeNull();
        expect(property!.noOfRooms).toBe(2);
    });

    it('Should not update the number of rooms if roomtype is neither of BEDROOM, KITCHEN, LIVING_ROOM', async () => {
        // Given
        let property: Property | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generateProperty())
            .withSave(async p => {
                property = p;
            })
            .build();

        const useCase = new AddRoomToPropertyUseCase(propertyRepository);

        // When
        await useCase.execute(
            {
                ...request,
                roomType: randomItemInArray(
                    RoomTypes.filter(rt => {
                        return (
                            rt !== RoomType.BEDROOM &&
                            rt !== RoomType.LIVING_ROOM &&
                            rt !== RoomType.KITCHEN
                        );
                    })
                )
            },
            presenter
        );

        console.log(property);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).toBeFalsy();
        expect(property).not.toBeNull();
        expect(property!.noOfRooms).toBe(1);
    });

    it('Should show error if property does not exists', async () => {
        // Given
        let property: Property | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => null)
            .build();

        const useCase = new AddRoomToPropertyUseCase(propertyRepository);

        // When
        await useCase.execute(request, presenter);

        console.log(presenter.response.errors);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBeFalsy();
        expect(presenter.response.room).toBe(null);
        expect(presenter.response?.errors?.propertyId).toHaveLength(1);
        expect(property).toBeNull();
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: AddRoomToPropertyRequest }[] =
            [
                {
                    label: 'Invalid propertyId',
                    request: {
                        ...request,
                        propertyId: 'invalid uuid'
                    }
                }
            ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
                // Given
                const propertyRepository = new PropertyRepositoryBuilder()
                    .withGetPropertyById(async () => null)
                    .build();

                const useCase = new AddRoomToPropertyUseCase(
                    propertyRepository
                );

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response.errors).not.toBe(null);
                console.log(presenter.response.errors);
            }
        );
    });
});
