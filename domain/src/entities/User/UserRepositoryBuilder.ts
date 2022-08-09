import { User, UserRepository } from '.';

export class UserRepositoryBuilder {
    private getAll: () => Promise<User[]> = () => Promise.resolve([]);
    private getUserById: (id: string) => Promise<User | null> = () =>
        Promise.resolve(null);

    withGetAll(getAll: () => Promise<User[]>) {
        this.getAll = getAll;
        return this;
    }

    withGetUserById(getUserById: (id: string) => Promise<User | null>) {
        this.getUserById = getUserById;
        return this;
    }

    build(): UserRepository {
        return {
            getAll: this.getAll,
            getUserById: this.getUserById
        };
    }
}
