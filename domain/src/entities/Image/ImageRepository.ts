import { Image } from './';

export interface ImageRepository {
    getImageById(id: string): Promise<Image | null>;
    save(entity: Image): Promise<void>;
}
