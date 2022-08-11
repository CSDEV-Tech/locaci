import { Room, RoomRepository } from '.';

export class RoomRepositoryBuilder {
    private save: (room: Room) => Promise<void> = () => Promise.resolve();
    private deleteRoom: (roomId: string) => Promise<void> = () =>
        Promise.resolve();

    withSave(save: (room: Room) => Promise<void>) {
        this.save = save;
        return this;
    }

    withDeleteRoom(deleteRoom: (roomId: string) => Promise<void>) {
        this.deleteRoom = deleteRoom;
        return this;
    }

    build(): RoomRepository {
        return {
            save: this.save,
            deleteRoom: this.deleteRoom
        };
    }
}
