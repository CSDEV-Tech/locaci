import { AddAmenityToPropertyResponse } from './AddAmenityToPropertyResponse';

export interface AddAmenityToPropertyPresenter {
    present: (response: AddAmenityToPropertyResponse) => void;
}
