import { AddRoomToPropertyResponse } from './AddRoomToPropertyResponse';

export interface AddRoomToPropertyPresenter {
    present: (response: AddRoomToPropertyResponse) => void;
}
