import { UpdatePropertyInformationsResponse } from './UpdatePropertyInformationsResponse';

export interface UpdatePropertyInformationsPresenter {
    present: (response: UpdatePropertyInformationsResponse) => void;
}
