import {
    CreatePropertyRequest,
    CreatePropertyUseCase,
    CreatePropertyPresenter,
    CreatePropertyResponse
} from '../../src';
import { expect, describe, it } from 'vitest';

const presenter = new (class implements CreatePropertyPresenter {
    response: CreatePropertyResponse;

    present(response: CreatePropertyResponse): void {
        this.response = response;
    }
})();

const request: CreatePropertyRequest = {};

describe('CreateProperty Use case', () => {
    it('is successful', async () => {
        // Given
        const useCase = new CreatePropertyUseCase();

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
    });

    it.todo('Negative Use Case');

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: CreatePropertyRequest }[] = [
            // TODO: Specify requests
            {
                label: 'Example label',
                request: {
                    ...request
                }
            }
        ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
                // // Given
                // const useCase = new CreatePropertyUseCase();
                //
                // // When
                // await useCase.execute(request, presenter);
                //
                // // Then
                // expect(presenter.response!.errors).not.toBe(null);
                expect(true).toBe(true);
            }
        );
    });
});
