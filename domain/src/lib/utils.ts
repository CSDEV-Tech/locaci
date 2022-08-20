import type { GenerateMockOptions } from '@anatine/zod-mock';
import { faker } from '@faker-js/faker';

import type { z } from 'zod';
import { generateMock as trueGenerateMock } from '@anatine/zod-mock';

export function generateMock<T extends z.ZodTypeAny>(
    zodRef: T,
    defaultValue?: Partial<z.infer<typeof zodRef>>,
    options?: GenerateMockOptions
) {
    return {
        // @ts-ignore
        ...trueGenerateMock(zodRef, options),
        ...defaultValue
    };
}

export function randomItemInArray<T>(array: Array<T>): T {
    const index = faker.datatype.number({ min: 0, max: array.length - 1 });
    return array[index];
}

/**
 * Generate an array of numbers from start to the end
 *
 * @example
 *      range(1, 5);
 *      // => [1, 2, 3, 4]
 * @param start
 * @param end
 * @returns
 */
export function range(start: number, end: number): number[] {
    return Array.from({ length: end - start }, (_, i) => i + start);
}
