import { Image } from './';

export interface ImageRepository {
    getImageById(id: string): Promise<Image | null>;
    deleteImage(id: string): Promise<void>;
    save(entity: Image): Promise<void>;
}
