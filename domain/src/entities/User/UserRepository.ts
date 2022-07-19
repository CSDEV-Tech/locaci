import { User } from './';

export interface UserRepository {
    getUserById(id: string): Promise<User | null>;
    getAll(): Promise<User[]>;
}
