import { __entt__ } from './';

export interface __entt__Repository {
    get__entt__ById(id: string): Promise<__entt__ | null>;
    save(entity: __entt__): Promise<__entt__>;
}
