import { Room, RoomRepository } from '../../src';

export class RoomRepositoryBuilder {
    private save: (property: Room) => Promise<void> = () => Promise.resolve();

    withSave(save: (property: Room) => Promise<void>) {
        this.save = save;
        return this;
    }

    build(): RoomRepository {
        return {
            save: this.save
        };
    }
}
