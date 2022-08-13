import { ArchivePropertyResponse } from './ArchivePropertyResponse';

export interface ArchivePropertyPresenter {
    present: (response: ArchivePropertyResponse) => void;
}
