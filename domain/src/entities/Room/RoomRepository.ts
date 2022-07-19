import { Room } from './';

export interface RoomRepository {
    getRoomById(id: string): Promise<Room | null>;
    getAll(): Promise<Room[]>;
}
