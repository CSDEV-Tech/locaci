import { Property, PropertyRepository } from '../../src';

export class PropertyRepositoryBuilder {
    private getAll: () => Promise<Property[]> = () => Promise.resolve([]);
    private getPropertyById: (id: string) => Promise<Property | null> = () =>
        Promise.resolve(null);

    withGetAll(getAll: () => Promise<Property[]>) {
        this.getAll = getAll;
        return this;
    }

    withGetPropertyById(
        getPropertyById: (id: string) => Promise<Property | null>
    ) {
        this.getPropertyById = getPropertyById;
        return this;
    }

    build(): PropertyRepository {
        return {
            getAll: this.getAll,
            getPropertyById: this.getPropertyById
        };
    }
}
