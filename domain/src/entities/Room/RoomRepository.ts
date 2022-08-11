import { Room } from './';

export interface RoomRepository {
    save(room: Room): Promise<void>;
    deleteRoom(roomId: string): Promise<void>;
}
