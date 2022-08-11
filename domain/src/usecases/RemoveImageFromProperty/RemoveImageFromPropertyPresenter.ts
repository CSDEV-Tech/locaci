import { RemoveImageFromPropertyResponse } from './RemoveImageFromPropertyResponse';

export interface RemoveImageFromPropertyPresenter {
    present: (response: RemoveImageFromPropertyResponse) => void;
}
