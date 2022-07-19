import { RentTypes } from './../../src/entities/Property/Property';
import { UserRepositoryBuilder } from './../builder/UserRepositoryBuilder';
import { PropertyRepositoryBuilder } from './../builder/PropertyRepositoryBuilder';
import { generateUser } from './../factories/UserFactory';
import {
    CreatePropertyRequest,
    CreatePropertyUseCase,
    CreatePropertyPresenter,
    CreatePropertyResponse,
    CreatePropertyRequestSchema,
    generateMock,
    Role,
    randomItemInArray,
    RoomType
} from '../../src';
import faker from '@faker-js/faker';

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

        console.log(request);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response.errors).toBeFalsy();
        expect(presenter.response.property).not.toBe(null);
        expect(presenter.response.property?.owner).not.toBeFalsy();
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
});
