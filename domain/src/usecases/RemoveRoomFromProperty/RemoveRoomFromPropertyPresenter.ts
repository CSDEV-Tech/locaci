import { RemoveRoomFromPropertyResponse } from './RemoveRoomFromPropertyResponse';

export interface RemoveRoomFromPropertyPresenter {
    present: (response: RemoveRoomFromPropertyResponse) => void;
}
