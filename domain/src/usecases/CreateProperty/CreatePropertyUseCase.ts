import { CreatePropertyRequest, CreatePropertyRequestSchema } from './CreatePropertyRequest';
import { CreatePropertyPresenter } from './CreatePropertyPresenter';
import { ValidateResult } from './../../lib/types';

export class CreatePropertyUseCase {
    schema = CreatePropertyRequestSchema;

    async execute(
        request: CreatePropertyRequest,
        presenter: CreatePropertyPresenter
    ): Promise<void> {
        // TODO : UseCase Logic
        let { errors, parsedRequest } = this.validate(request);

        presenter.present({
            errors
        });
    }

    validate(request: CreatePropertyRequest): ValidateResult<CreatePropertyRequest> {
        // TODO : Validation Rules
        const parsedResult = this.schema.safeParse(request);

        if (!parsedResult.success) {
            return {
                errors: parsedResult.error.flatten().fieldErrors
            };
        } else {
            return {
                parsedRequest: parsedResult.data
            };
        }
    }
}
