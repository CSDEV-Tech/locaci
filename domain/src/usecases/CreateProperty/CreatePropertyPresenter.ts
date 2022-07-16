import { CreatePropertyResponse } from './CreatePropertyResponse';

export interface CreatePropertyPresenter {
    present: (response: CreatePropertyResponse) => void;
}
