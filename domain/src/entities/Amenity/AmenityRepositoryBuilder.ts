import { Amenity, AmenityRepository } from '.';

export class AmenityRepositoryBuilder {
    private save: (property: Amenity) => Promise<void> = () =>
        Promise.resolve();

    withSave(save: (property: Amenity) => Promise<void>) {
        this.save = save;
        return this;
    }

    build(): AmenityRepository {
        return {
            save: this.save
        };
    }
}
