import {
    AddAmenityToPropertyRequest,
    AddAmenityToPropertyRequestSchema
} from './AddAmenityToPropertyRequest';
import { AddAmenityToPropertyPresenter } from './AddAmenityToPropertyPresenter';
import { ValidateResult } from './../../lib/types';
import { PropertyRepository, RentType } from './../../entities/Property';
import {
    Amenity,
    AmenityRepository,
    AmenityType
} from '../../entities/Amenity';
import { Uuid } from '../../Dto';

export class AddAmenityToPropertyUseCase {
    schema = AddAmenityToPropertyRequestSchema;

    constructor(
        private propertyRepository: PropertyRepository,
        private amenityRepository: AmenityRepository
    ) {}

    async execute(
        request: AddAmenityToPropertyRequest,
        presenter: AddAmenityToPropertyPresenter
    ): Promise<void> {
        let res = this.validate(request);

        let errors = res.errors;
        let newAmenity: Amenity | null = null;

        if (!res.errors) {
            const property = await this.propertyRepository.getPropertyById(
                res.parsedRequest.propertyId
            );

            if (property) {
                if (
                    ![RentType.COLOCATION, RentType.LOCATION].includes(
                        property!.rentType
                    )
                ) {
                    newAmenity = {
                        id: new Uuid(),
                        type: res.parsedRequest.type
                    };

                    if (res.parsedRequest.type === AmenityType.OTHER) {
                        newAmenity.name = res.parsedRequest.name;
                    }

                    property!.amenities.push(newAmenity);

                    await this.propertyRepository.save(property!);
                    await this.amenityRepository.save(newAmenity);
                } else {
                    errors = {
                        propertyId: [
                            'Only properties with rentType of SHORT_TERM can have amenities'
                        ]
                    };
                }
            } else {
                errors = {
                    propertyId: [
                        `The property with id '${res.parsedRequest.propertyId}' does not exist.`
                    ]
                };
            }
        }

        presenter.present({
            errors,
            amenity: newAmenity
        });
    }

    validate(
        request: AddAmenityToPropertyRequest
    ): ValidateResult<AddAmenityToPropertyRequest> {
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
