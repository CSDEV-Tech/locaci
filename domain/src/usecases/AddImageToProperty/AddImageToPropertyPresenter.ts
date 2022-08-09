import { AddImageToPropertyResponse } from './AddImageToPropertyResponse';

export interface AddImageToPropertyPresenter {
    present: (response: AddImageToPropertyResponse) => void;
}
