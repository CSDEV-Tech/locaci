import { RentTypes } from './../../src/entities/Property/Property';
import { UserRepositoryBuilder } from './../builder/UserRepositoryBuilder';
import { PropertyRepositoryBuilder } from './../builder/PropertyRepositoryBuilder';
import { generateUser } from './../factories/UserFactory';
import {
    CreatePropertyUseCase,
    CreatePropertyPresenter,
    CreatePropertyResponse,
    CreatePropertyRequestSchema,
    CreatePropertyRequest,
    generateMock,
    Role,
    randomItemInArray,
    RoomType
} from '../../src';

import { expect, describe, it } from 'vitest';

const presenter = new (class implements CreatePropertyPresenter {
    response: CreatePropertyResponse;

    present(response: CreatePropertyResponse): void {
        this.response = response;
    }
})();

const request = generateMock(CreatePropertyRequestSchema, {
    rentType: randomItemInArray(RentTypes)
});

describe('CreateProperty Use case', () => {
    it('is successful', async () => {
        const propertyRepository = new PropertyRepositoryBuilder().build();
        const userRepository = new UserRepositoryBuilder()
            .withGetUserById(async () => {
                return generateUser({
                    role: Role.PROPERTY_OWNER
                });
            })
            .build();

        // Given
        const useCase = new CreatePropertyUseCase(
            propertyRepository,
            userRepository
        );

        // When
        await useCase.execute(
            {
                ...request
            },
            presenter
        );

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).toBeFalsy();
        expect(presenter.response.property).not.toBe(null);
        expect(presenter.response.property?.owner).not.toBeFalsy();
    });

    it('should show error if owner does not exist', async () => {
        const propertyRepository = new PropertyRepositoryBuilder().build();
        const userRepository = new UserRepositoryBuilder()
            .withGetUserById(() => Promise.resolve(null))
            .build();

        // Given
        const useCase = new CreatePropertyUseCase(
            propertyRepository,
            userRepository
        );

        // When
        await useCase.execute(
            {
                ...request
            },
            presenter
        );

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).not.toBeFalsy();
        expect(presenter.response.property).toBe(null);
    });

    it('should create a bedroom for the property by default', async () => {
        const propertyRepository = new PropertyRepositoryBuilder().build();
        const userRepository = new UserRepositoryBuilder()
            .withGetUserById(async () => {
                return generateUser({
                    role: Role.PROPERTY_OWNER
                });
            })
            .build();

        // Given
        const useCase = new CreatePropertyUseCase(
            propertyRepository,
            userRepository
        );

        // When
        await useCase.execute(
            {
                ...request
            },
            presenter
        );

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).toBeFalsy();
        expect(presenter.response.property).not.toBe(null);
        expect(presenter.response.property?.rooms).toHaveLength(1);
        expect(presenter.response.property?.rooms[0]?.type).toBe(
            RoomType.BEDROOM
        );
    });

    it('should set the number of rooms to 1 by default', async () => {
        const propertyRepository = new PropertyRepositoryBuilder().build();
        const userRepository = new UserRepositoryBuilder()
            .withGetUserById(async () => {
                return generateUser({
                    role: Role.PROPERTY_OWNER
                });
            })
            .build();

        // Given
        const useCase = new CreatePropertyUseCase(
            propertyRepository,
            userRepository
        );

        // When
        await useCase.execute(
            {
                ...request
            },
            presenter
        );

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).toBeFalsy();
        expect(presenter.response.property).not.toBe(null);
        expect(presenter.response.property?.noOfRooms).toBe(1);
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: CreatePropertyRequest }[] = [
            {
                label: 'Invalid position radius',
                request: {
                    ...request,
                    radius: 0
                }
            },
            {
                label: 'Invalid surface area',
                request: {
                    ...request,
                    surfaceArea: 8
                }
            },
            {
                label: 'Empty commune',
                request: {
                    ...request,
                    commune: ''
                }
            },
            {
                label: 'Empty district',
                request: {
                    ...request,
                    district: ''
                }
            },
            {
                label: 'Empty city',
                request: {
                    ...request,
                    city: ''
                }
            },
            {
                label: 'Invalid ownerId',
                request: {
                    ...request,
                    ownerId: 'blabla'
                }
            }
        ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
                const propertyRepository =
                    new PropertyRepositoryBuilder().build();
                const userRepository = new UserRepositoryBuilder()
                    .withGetUserById(async () => {
                        return generateUser({
                            role: Role.PROPERTY_OWNER
                        });
                    })
                    .build();

                // Given
                const useCase = new CreatePropertyUseCase(
                    propertyRepository,
                    userRepository
                );

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response.errors).not.toBe(null);
                expect(presenter.response.property).toBe(null);
                console.log(presenter.response.errors);
            }
        );
    });
});
