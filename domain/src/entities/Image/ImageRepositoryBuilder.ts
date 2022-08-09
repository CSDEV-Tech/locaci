import { Image, ImageRepository } from '.';

export class ImageRepositoryBuilder {
    private save: (entity: Image) => Promise<void> = (entity: Image) =>
        Promise.resolve();
    private getImageById: (id: string) => Promise<Image | null> = () =>
        Promise.resolve(null);

    withSave(save: (entity: Image) => Promise<void>) {
        this.save = save;
        return this;
    }

    withGetImageById(getImageById: (id: string) => Promise<Image | null>) {
        this.getImageById = getImageById;
        return this;
    }

    build(): ImageRepository {
        return {
            save: this.save,
            getImageById: this.getImageById
        };
    }
}
