import { Amenity } from './';

export interface AmenityRepository {
    save(amenity: Amenity): Promise<void>;
}
