import { __entt__, __entt__Repository } from '../../src';

export class __entt__RepositoryBuilder {
    private getAll: () => Promise<__entt__[]> = () => Promise.resolve([]);
    private get__entt__ById: (id: string) => Promise<__entt__ | null> = () =>
        Promise.resolve(null);

    withGetAll(getAll: () => Promise<__entt__[]>) {
        this.getAll = getAll;
        return this;
    }

    withGet__entt__ById(
        get__entt__ById: (id: string) => Promise<__entt__ | null>
    ) {
        this.get__entt__ById = get__entt__ById;
        return this;
    }

    build(): __entt__Repository {
        return {
            getAll: this.getAll,
            get__entt__ById: this.get__entt__ById
        };
    }
}
