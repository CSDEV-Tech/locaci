import { __entt__, __entt__Repository } from '.';

export class __entt__RepositoryBuilder {
    private save: (entity: __entt__) => Promise<__entt__> = (
        entity: __entt__
    ) => Promise.resolve(entity);
    private get__entt__ById: (id: string) => Promise<__entt__ | null> = () =>
        Promise.resolve(null);

    withSave(save: (entity: __entt__) => Promise<__entt__>) {
        this.save = save;
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
            save: this.save,
            get__entt__ById: this.get__entt__ById
        };
    }
}
