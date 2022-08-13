import { __UC__Request, __UC__RequestSchema } from './__UC__Request';
import { __UC__Presenter } from './__UC__Presenter';
import { ValidateResult } from './../../lib/types';

export class __UC__UseCase {
    schema = __UC__RequestSchema;

    async execute(
        request: __UC__Request,
        presenter: __UC__Presenter
    ): Promise<void> {
        const res = this.validate(request);

        let errors = res.errors;

        if (!res.errors) {
            // TODO : UseCase Logic
        }

        presenter.present({
            errors
        });
    }

    validate(request: __UC__Request): ValidateResult<__UC__Request> {
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
