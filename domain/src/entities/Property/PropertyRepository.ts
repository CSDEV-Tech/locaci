import { Property } from './';

export interface PropertyRepository {
    getPropertyById(id: string): Promise<Property | null>;
    getAll(): Promise<Property[]>;
}
