import {
    ArchivePropertyRequest,
    ArchivePropertyRequestSchema
} from './ArchivePropertyRequest';
import { ArchivePropertyPresenter } from './ArchivePropertyPresenter';
import { ValidateResult } from './../../lib/types';
import { Property, PropertyRepository } from '../../entities/Property';
import { ListingRepository } from '../../entities/Listing';
import { RentalRepository } from '../../entities/Rental';

export class ArchivePropertyUseCase {
    schema = ArchivePropertyRequestSchema;

    constructor(
        private propertyRepository: PropertyRepository,
        private listingRepository: ListingRepository,
        private rentalRepository: RentalRepository
    ) {}

    async execute(
        request: ArchivePropertyRequest,
        presenter: ArchivePropertyPresenter
    ): Promise<void> {
        const res = this.validate(request);

        let errors = res.errors;

        if (!res.errors) {
            const rentals =
                await this.rentalRepository.getActiveOrReservedRentalsForProperty(
                    res.parsedRequest.propertyId
                );

            if (rentals.length > 0) {
                errors = {
                    propertyId: [
                        'You cannot archive this property because there are people renting this.'
                    ]
                };
            } else {
                const property = await this.propertyRepository.getPropertyById(
                    res.parsedRequest.propertyId
                );

                if (!property) {
                    errors = {
                        propertyId: [
                            `The property with '${res.parsedRequest.propertyId}' does not exists`
                        ]
                    };
                } else {
                    if (
                        property.owner.id.toString() !==
                        res.parsedRequest.userId
                    ) {
                        errors = {
                            userId: [
                                `You cannot archive this property because you are not the owner.`
                            ]
                        };
                    } else {
                        property.archived = true;

                        await this.propertyRepository.save(property);
                        await this.listingRepository.deleteActiveListingsForProperty(
                            property.id.toString()
                        );
                    }
                }
            }
        }

        presenter.present({
            errors
        });
    }

    validate(
        request: ArchivePropertyRequest
    ): ValidateResult<ArchivePropertyRequest> {
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
