import {
    AddImageToPropertyRequest,
    AddImageToPropertyRequestSchema
} from './AddImageToPropertyRequest';
import { AddImageToPropertyPresenter } from './AddImageToPropertyPresenter';
import { ValidateResult } from './../../lib/types';
import { PropertyRepository } from '../../entities/Property';
import { Image, ImageRepository } from '../../entities/Image';
import { Uuid } from '../../Dto';

export class AddImageToPropertyUseCase {
    schema = AddImageToPropertyRequestSchema;

    constructor(
        private propertyRepository: PropertyRepository,
        private imageRepository: ImageRepository
    ) {}

    async execute(
        request: AddImageToPropertyRequest,
        presenter: AddImageToPropertyPresenter
    ): Promise<void> {
        let res = this.validate(request);

        let errors = res.errors;
        if (!res.errors) {
            const property = await this.propertyRepository.getPropertyById(
                res.parsedRequest.propertyId
            );

            if (property) {
                if (property.owner.id === res.parsedRequest.userId) {
                    const image: Image = {
                        id: new Uuid(),
                        path: res.parsedRequest.path
                    };
                    property.images.push(image);

                    this.propertyRepository.save(property);
                    this.imageRepository.save(image);
                } else {
                    errors = {
                        userId: [
                            `This user is not the owner of the property and thus cannot add a room to the property`
                        ]
                    };
                }
            } else {
                errors = {
                    propertyId: [
                        `The property with id '${res.parsedRequest.propertyId}' does exists.`
                    ]
                };
            }
        }

        presenter.present({
            errors
        });
    }

    validate(
        request: AddImageToPropertyRequest
    ): ValidateResult<AddImageToPropertyRequest> {
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
