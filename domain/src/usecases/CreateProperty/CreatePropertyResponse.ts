import { CreatePropertyRequest } from './CreatePropertyRequest';
import { FieldErrors } from '../../lib/types';

export type CreatePropertyResponse =
    | {
          errors: FieldErrors<CreatePropertyRequest>;
      }
    | {
          // TODO: Response args
      };
