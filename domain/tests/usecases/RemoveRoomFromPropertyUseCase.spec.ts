import {
    RemoveRoomFromPropertyRequestSchema,
    RemoveRoomFromPropertyUseCase,
    RemoveRoomFromPropertyPresenter,
    RemoveRoomFromPropertyResponse,
    generateMock,
    Property,
    PropertyRepositoryBuilder,
    RoomRepositoryBuilder,
    Uuid,
    RoomType
} from '../../src';

import { expect, describe, it } from 'vitest';
import { generateProperty } from '../factories/PropertyFactory';
import { generateUser } from '../factories/UserFactory';

const presenter = new (class implements RemoveRoomFromPropertyPresenter {
    response: RemoveRoomFromPropertyResponse;

    present(response: RemoveRoomFromPropertyResponse): void {
        this.response = response;
    }
})();

const request = generateMock(RemoveRoomFromPropertyRequestSchema, {
    // TODO: overrides
});

describe('RemoveRoomFromProperty Use case', () => {
    it('removes successfully the room', async () => {
        // Given
        let property: Property | null = null;
        let removedRoomId: string | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    }),
                    rooms: [
                        {
                            id: new Uuid(),
                            type: RoomType.BEDROOM
                        },
                        {
                            id: new Uuid(request.roomId),
                            type: RoomType.BATHROOM
                        }
                    ]
                })
            )
            .withSave(async p => {
                property = p;
            })
            .build();
        const roomRepository = new RoomRepositoryBuilder()
            .withDeleteRoom(async roomId => {
                removedRoomId = roomId;
            })
            .build();

        const useCase = new RemoveRoomFromPropertyUseCase(
            propertyRepository,
            roomRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(property).not.toBeNull();
        expect(removedRoomId).toBe(request.roomId);
        expect(property!.rooms).toHaveLength(1);
    });

    it('cannot remove a bedroom if there is only one', async () => {
        // Given
        let property: Property | null = null;
        let removedRoomId: string | null = null;
        const generatedProperty = generateProperty({
            owner: generateUser({
                id: new Uuid(request.userId)
            }),
            noOfRooms: 2,
            rooms: [
                {
                    id: new Uuid(request.roomId),
                    type: RoomType.BEDROOM
                },
                {
                    id: new Uuid(),
                    type: RoomType.KITCHEN
                },
                {
                    id: new Uuid(),
                    type: RoomType.BATHROOM
                }
            ]
        });

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generatedProperty)
            .withSave(async p => {
                property = p;
            })
            .build();
        const roomRepository = new RoomRepositoryBuilder()
            .withDeleteRoom(async roomId => {
                removedRoomId = roomId;
            })
            .build();

        const useCase = new RemoveRoomFromPropertyUseCase(
            propertyRepository,
            roomRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).not.toBe(null);
        expect(presenter.response.errors?.roomId).toHaveLength(1);
        expect(generatedProperty.rooms).toHaveLength(3);
        expect(property).toBeNull();
        expect(removedRoomId).toBeNull();
    });

    it('Should update the number of rooms if roomtype is either BEDROOM, KITCHEN, LIVING_ROOM', async () => {
        // Given
        let property: Property | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    }),
                    noOfRooms: 2,
                    rooms: [
                        {
                            id: new Uuid(),
                            type: RoomType.BEDROOM
                        },
                        {
                            id: new Uuid(request.roomId),
                            type: RoomType.KITCHEN
                        },
                        {
                            id: new Uuid(),
                            type: RoomType.BATHROOM
                        }
                    ]
                })
            )
            .withSave(async p => {
                property = p;
            })
            .build();
        const roomRepository = new RoomRepositoryBuilder().build();

        const useCase = new RemoveRoomFromPropertyUseCase(
            propertyRepository,
            roomRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(property).not.toBe(null);
        expect(property!.noOfRooms).toBe(1);
    });

    it('Should not update the number of rooms if roomtype is neither BEDROOM, KITCHEN, LIVING_ROOM', async () => {
        // Given
        let property: Property | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () =>
                generateProperty({
                    owner: generateUser({
                        id: new Uuid(request.userId)
                    }),
                    noOfRooms: 2,
                    rooms: [
                        {
                            id: new Uuid(),
                            type: RoomType.BEDROOM
                        },
                        {
                            id: new Uuid(),
                            type: RoomType.KITCHEN
                        },
                        {
                            id: new Uuid(request.roomId),
                            type: RoomType.BATHROOM
                        }
                    ]
                })
            )
            .withSave(async p => {
                property = p;
            })
            .build();
        const roomRepository = new RoomRepositoryBuilder().build();

        const useCase = new RemoveRoomFromPropertyUseCase(
            propertyRepository,
            roomRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(property).not.toBe(null);
        expect(property!.noOfRooms).toBe(2);
    });

    it('Should show error the room is not included in the property', async () => {
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
        const roomRepository = new RoomRepositoryBuilder().build();

        const useCase = new RemoveRoomFromPropertyUseCase(
            propertyRepository,
            roomRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).not.toBe(null);
        expect(presenter.response.errors?.roomId).toHaveLength(1);
        expect(property).toBeNull();
    });

    it('Should show error if property does not exists', async () => {
        // Given
        let property: Property | null = null;

        const roomRepository = new RoomRepositoryBuilder().build();
        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => null)
            .withSave(async p => {
                property = p;
            })
            .build();

        const useCase = new RemoveRoomFromPropertyUseCase(
            propertyRepository,
            roomRepository
        );

        // When
        await useCase.execute(request, presenter);

        console.log({ errors: presenter.response.errors });

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBeFalsy();
        expect(presenter.response?.errors?.propertyId).toHaveLength(1);
        expect(property).toBeNull();
    });

    it('Should show error if the user is not the owner of the property', async () => {
        // Given
        let property: Property | null = null;

        const propertyRepository = new PropertyRepositoryBuilder()
            .withGetPropertyById(async () => generateProperty())
            .withSave(async p => {
                property = p;
            })
            .build();
        const roomRepository = new RoomRepositoryBuilder().build();

        const useCase = new RemoveRoomFromPropertyUseCase(
            propertyRepository,
            roomRepository
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
    });
});
