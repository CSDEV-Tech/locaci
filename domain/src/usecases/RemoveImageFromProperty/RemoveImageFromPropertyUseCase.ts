import {
    RemoveImageFromPropertyRequest,
    RemoveImageFromPropertyRequestSchema
} from './RemoveImageFromPropertyRequest';
import { RemoveImageFromPropertyPresenter } from './RemoveImageFromPropertyPresenter';
import { ValidateResult } from './../../lib/types';
import { Property, PropertyRepository } from '../../entities/Property';
import { ImageRepository } from '../../entities/Image';

export class RemoveImageFromPropertyUseCase {
    schema = RemoveImageFromPropertyRequestSchema;

    constructor(
        private propertyRepository: PropertyRepository,
        private imageRepository: ImageRepository
    ) {}

    async execute(
        request: RemoveImageFromPropertyRequest,
        presenter: RemoveImageFromPropertyPresenter
    ): Promise<void> {
        const res = this.validate(request);

        let errors = res.errors;

        if (!res.errors) {
            const property = await this.propertyRepository.getPropertyById(
                res.parsedRequest.propertyId
            );

            if (property) {
                if (property.owner.id.toString() === res.parsedRequest.userId) {
                    const imageToDelete = property.images.find(
                        im => im.id.toString() === res.parsedRequest.imageId
                    );

                    if (imageToDelete) {
                        property.images = property.images.filter(
                            im => im.id.toString() === res.parsedRequest.imageId
                        );

                        await this.propertyRepository.save(property);
                        await this.imageRepository.deleteImage(
                            res.parsedRequest.imageId
                        );
                    } else {
                        errors = {
                            imageId: [
                                'The image you are trying to delete is not included in the property.'
                            ]
                        };
                    }
                } else {
                    errors = {
                        userId: [
                            `This user is not the owner of the property and thus cannot remove the image from the property`
                        ]
                    };
                }
            } else {
                errors = {
                    propertyId: [
                        `The property with id '${res.parsedRequest.propertyId}' does not exists.`
                    ]
                };
            }
        }

        presenter.present({
            errors
        });
    }

    validate(
        request: RemoveImageFromPropertyRequest
    ): ValidateResult<RemoveImageFromPropertyRequest> {
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
