import {
    UpdatePropertyInformationsRequest,
    UpdatePropertyInformationsRequestSchema
} from './UpdatePropertyInformationsRequest';
import { UpdatePropertyInformationsPresenter } from './UpdatePropertyInformationsPresenter';
import { ValidateResult } from './../../lib/types';
import { Property, PropertyRepository } from '../../entities/Property';
import { ListingRepository } from '../../entities/Listing';

export class UpdatePropertyInformationsUseCase {
    schema = UpdatePropertyInformationsRequestSchema;

    constructor(private propertyRepository: PropertyRepository) {}

    async execute(
        request: UpdatePropertyInformationsRequest,
        presenter: UpdatePropertyInformationsPresenter
    ): Promise<void> {
        let res = this.validate(request);

        let errors = res.errors;

        if (!res.errors) {
            let property = await this.propertyRepository.getPropertyById(
                res.parsedRequest.propertyId
            );

            if (property) {
                if (property.owner.id === res.parsedRequest.userId) {
                    property = {
                        ...property,
                        ...res.parsedRequest,
                        position: {
                            longitude: res.parsedRequest.longitude,
                            latitude: res.parsedRequest.latitude,
                            radius: res.parsedRequest.radius
                        }
                    };

                    await this.propertyRepository.save(property);
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
        request: UpdatePropertyInformationsRequest
    ): ValidateResult<UpdatePropertyInformationsRequest> {
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
