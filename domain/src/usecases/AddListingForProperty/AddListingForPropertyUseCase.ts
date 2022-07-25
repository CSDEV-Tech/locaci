import { AddListingForPropertyRequestSchema } from './AddListingForPropertyRequest';
import { RentType } from '../../entities/Property';
import { Uuid } from '../../Dto';
import { RoomType } from '../../entities/Room';

import type { AddListingForPropertyPresenter } from './AddListingForPropertyPresenter';
import type { ValidateResult } from './../../lib/types';
import type { Listing, ListingRepository } from '../../entities/Listing';
import type { AddListingForPropertyRequest } from './AddListingForPropertyRequest';
import type { Property, PropertyRepository } from '../../entities/Property';

export class AddListingForPropertyUseCase {
    schema = AddListingForPropertyRequestSchema;

    constructor(
        private propertyRepository: PropertyRepository,
        private listingRepository: ListingRepository
    ) {}

    async execute(
        request: AddListingForPropertyRequest,
        presenter: AddListingForPropertyPresenter
    ): Promise<void> {
        let res = this.validate(request);

        let errors = res.errors;
        let listing: Listing | null = null;
        if (!res.errors) {
            const property = await this.propertyRepository.getPropertyById(
                res.parsedRequest.propertyId
            );

            if (!property) {
                errors = {
                    propertyId: [
                        `The property with id '${res.parsedRequest.propertyId}' does not exist.`
                    ]
                };
            } else {
                errors = await this.checkIfCanAddListing(
                    res.parsedRequest,
                    property
                );

                if (!errors) {
                    // set tne number of free bedrooms only for COLOCATION
                    //  because for the others they rent all the available rooms
                    const noOfFreeBedRooms =
                        property.rentType !== RentType.COLOCATION
                            ? undefined
                            : res.parsedRequest.noOfFreeBedRooms;

                    // set the default housing period to 1 or 30 based on the rent type
                    //  1 - for short term because the billing is daily
                    //  30 - for other because the billing is monthly
                    const housingPeriod =
                        res.parsedRequest.housingPeriod ??
                        property.rentType === RentType.SHORT_TERM
                            ? 1
                            : 30;

                    // Set the agency month advance only on LOCATION,
                    //  because it is the only rent type in which it is applicable
                    const agencyMonthsPaymentAdvance =
                        property.rentType === RentType.LOCATION
                            ? res.parsedRequest.agencyMonthsPaymentAdvance ?? 0
                            : undefined;

                    // Do not set the caution advance for short term because it is not applicable
                    const cautionMonthsPaymentAdvance =
                        property.rentType === RentType.SHORT_TERM
                            ? undefined
                            : res.parsedRequest.cautionMonthsPaymentAdvance;

                    listing = {
                        property: property,
                        id: new Uuid(),
                        active: true,
                        description: res.parsedRequest.description,
                        housingFee: res.parsedRequest.housingFee,
                        housingPeriod,
                        agencyMonthsPaymentAdvance,
                        noOfFreeBedRooms,
                        availableFrom: res.parsedRequest.availableFrom,
                        cautionMonthsPaymentAdvance:
                            property.rentType === RentType.LOCATION
                                ? cautionMonthsPaymentAdvance ?? 0
                                : cautionMonthsPaymentAdvance
                    };

                    await this.listingRepository.save(listing);
                }
            }
        }

        presenter.present({
            errors,
            newListing: listing
        });
    }

    async checkIfCanAddListing(
        req: AddListingForPropertyRequest,
        property: Property
    ) {
        if (property.owner.id !== req.userId) {
            return {
                userId: [
                    `This user is not the owner of the property and thus cannot add a room to the property.`
                ]
            };
        }

        const activeListings =
            await this.listingRepository.getActiveListingsForProperty(
                req.propertyId
            );

        if (activeListings.length > 0) {
            return {
                global: [
                    'You cannot have two active listings at the same time.'
                ]
            };
        }

        const totalBedRooms = property.rooms.filter(
            r => r.type === RoomType.BEDROOM
        ).length;

        if (
            property.rentType === RentType.COLOCATION &&
            req.noOfFreeBedRooms !== undefined &&
            req.noOfFreeBedRooms > totalBedRooms
        ) {
            return {
                noOfFreeBedRooms: [
                    'The number of free bedrooms cannot exceed the total of bedrooms in property'
                ]
            };
        }
    }

    validate(
        request: AddListingForPropertyRequest
    ): ValidateResult<AddListingForPropertyRequest> {
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
