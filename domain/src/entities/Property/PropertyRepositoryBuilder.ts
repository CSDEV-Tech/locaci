import { Property, PropertyRepository } from '.';

export class PropertyRepositoryBuilder {
    private getAll: () => Promise<Property[]> = () => Promise.resolve([]);
    private getPropertyById: (id: string) => Promise<Property | null> = () =>
        Promise.resolve(null);
    private save: (property: Property) => Promise<void> = () =>
        Promise.resolve();

    withGetAll(getAll: () => Promise<Property[]>) {
        this.getAll = getAll;
        return this;
    }

    withSave(save: (property: Property) => Promise<void>) {
        this.save = save;
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
            getPropertyById: this.getPropertyById,
            save: this.save
        };
    }
}
