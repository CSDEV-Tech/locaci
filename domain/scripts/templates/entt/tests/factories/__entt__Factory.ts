import type { __entt__ } from '../../src';
import { faker } from '@faker-js/faker';

export function generate__entt__(defaultValue?: Partial<__entt__>): __entt__ {
    return {
        // TODO: generate factory
        ...defaultValue
    };
}
