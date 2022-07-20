import {
    __UC__RequestSchema,
    __UC__UseCase,
    __UC__Presenter,
    __UC__Response,
    generateMock,
    __UC__Request
} from '../../src';

import { expect, describe, it } from 'vitest';

const presenter = new (class implements __UC__Presenter {
    response: __UC__Response;

    present(response: __UC__Response): void {
        this.response = response;
    }
})();

const request = generateMock(__UC__RequestSchema, {
    // TODO: overrides
});

describe('__UC__ Use case', () => {
    it('is successful', async () => {
        // Given
        const useCase = new __UC__UseCase();

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
    });

    it.todo('Negative Use Case');

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: __UC__Request }[] = [
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
                // const useCase = new __UC__UseCase();
                //
                // // When
                // await useCase.execute(request, presenter);
                //
                // // Then
                // expect(presenter.response.errors).not.toBe(null);
                expect(true).toBe(false);
            }
        );
    });
});
