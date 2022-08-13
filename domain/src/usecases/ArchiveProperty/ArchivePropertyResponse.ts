import { ArchivePropertyRequest } from './ArchivePropertyRequest';
import { FieldErrors } from '../../lib/types';

export type ArchivePropertyResponse = {
    errors?: FieldErrors<ArchivePropertyRequest>;
    // TODO: Response args
};
