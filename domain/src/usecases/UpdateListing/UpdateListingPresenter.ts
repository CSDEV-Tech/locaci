import { UpdateListingResponse } from './UpdateListingResponse';

export interface UpdateListingPresenter {
    present: (response: UpdateListingResponse) => void;
}
