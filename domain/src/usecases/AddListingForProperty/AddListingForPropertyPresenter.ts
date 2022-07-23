import { AddListingForPropertyResponse } from './AddListingForPropertyResponse';

export interface AddListingForPropertyPresenter {
    present: (response: AddListingForPropertyResponse) => void;
}
