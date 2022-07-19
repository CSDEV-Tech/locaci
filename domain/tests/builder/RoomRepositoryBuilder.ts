import { Room, RoomRepository } from '../../src';

export class RoomRepositoryBuilder {
    private getAll: () => Promise<Room[]> = () => Promise.resolve([]);
    private getRoomById: (id: string) => Promise<Room | null> = () =>
        Promise.resolve(null);

    withGetAll(getAll: () => Promise<Room[]>) {
        this.getAll = getAll;
        return this;
    }

    withGetRoomById(
        getRoomById: (id: string) => Promise<Room | null>
    ) {
        this.getRoomById = getRoomById;
        return this;
    }

    build(): RoomRepository {
        return {
            getAll: this.getAll,
            getRoomById: this.getRoomById
        };
    }
}
