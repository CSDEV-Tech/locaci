import {
    UpdateListingRequest,
    UpdateListingRequestSchema
} from './UpdateListingRequest';
import { UpdateListingPresenter } from './UpdateListingPresenter';
import { ValidateResult } from './../../lib/types';
import {
    Property,
    PropertyRepository,
    RentType
} from '../../entities/Property';
import { Listing, ListingRepository } from '../../entities/Listing';
import { RentalRepository } from '../../entities/Rental';
import { RoomType } from '../../entities/Room';

export class UpdateListingUseCase {
    schema = UpdateListingRequestSchema;

    constructor(
        private propertyRepository: PropertyRepository,
        private listingRepository: ListingRepository,
        private rentalRepository: RentalRepository
    ) {}

    async execute(
        request: UpdateListingRequest,
        presenter: UpdateListingPresenter
    ): Promise<void> {
        // TODO : UseCase Logic
        const res = this.validate(request);

        let errors = res.errors;

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
                errors = await this.checkIfCanUpdateListing(
                    res.parsedRequest,
                    property
                );

                if (!errors) {
                    let listing = await this.listingRepository.getListingById(
                        res.parsedRequest.listingId
                    );

                    if (!listing) {
                        errors = {
                            listingId: [
                                `The listing with id '${res.parsedRequest.listingId}' does not exist.`
                            ]
                        };
                    } else if (listing.property.id !== property.id) {
                        errors = {
                            listingId: [
                                `This listing does not concern the property so it cannot be modified.`
                            ]
                        };
                    } else {
                        // set tne number of free bedrooms only for COLOCATION
                        //  because for the others they rent all the available rooms
                        const noOfFreeBedRooms =
                            property.rentType !== RentType.SHARED_APPARTMENT
                                ? undefined
                                : res.parsedRequest.noOfFreeBedRooms;

                        // Set the agency month advance only on LOCATION,
                        //  because it is the only rent type in which it is applicable
                        const agencyMonthsPaymentAdvance =
                            property.rentType === RentType.LOCATION
                                ? res.parsedRequest
                                      .agencyMonthsPaymentAdvance ?? 0
                                : undefined;

                        // Do not set the caution advance for short term because it is not applicable
                        const cautionMonthsPaymentAdvance =
                            property.rentType === RentType.SHORT_TERM
                                ? undefined
                                : res.parsedRequest.cautionMonthsPaymentAdvance;

                        listing = {
                            ...listing,
                            noOfFreeBedRooms,
                            description:
                                res.parsedRequest.description ??
                                listing.description,
                            housingFee:
                                res.parsedRequest.housingFee ??
                                listing.housingFee,
                            availableFrom:
                                res.parsedRequest.availableFrom ??
                                listing.availableFrom,
                            housingPeriod:
                                res.parsedRequest.housingPeriod ??
                                listing.housingPeriod,
                            agencyMonthsPaymentAdvance,
                            cautionMonthsPaymentAdvance,
                            active: res.parsedRequest.active ?? listing.active
                        };

                        await this.listingRepository.save(listing);
                    }
                }
            }
        }

        presenter.present({
            errors
        });
    }

    async checkIfCanUpdateListing(
        req: UpdateListingRequest,
        property: Property
    ) {
        const rentals =
            await this.rentalRepository.getActiveOrReservedRentalsForListing(
                req.listingId
            );

        if (rentals.length > 0) {
            return {
                listingId: [
                    'This listing cannot be modified because there is at least one rental associated with it'
                ]
            };
        }

        if (property.owner.id.toString() !== req.userId) {
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
            property.rentType === RentType.SHARED_APPARTMENT &&
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
        request: UpdateListingRequest
    ): ValidateResult<UpdateListingRequest> {
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
