import {
    type RemoveRoomFromPropertyRequest,
    RemoveRoomFromPropertyRequestSchema
} from './RemoveRoomFromPropertyRequest';
import type { RemoveRoomFromPropertyPresenter } from './RemoveRoomFromPropertyPresenter';
import type { ValidateResult } from './../../lib/types';
import type { Property, PropertyRepository } from '../../entities/Property';
import { type RoomRepository, RoomType, Room } from '../../entities/Room';
import type { ListingRepository } from '../../entities/Listing';

export class RemoveRoomFromPropertyUseCase {
    schema = RemoveRoomFromPropertyRequestSchema;

    constructor(
        private propertyRepository: PropertyRepository,
        private roomRepository: RoomRepository,
        private listingRepository: ListingRepository
    ) {}

    async execute(
        request: RemoveRoomFromPropertyRequest,
        presenter: RemoveRoomFromPropertyPresenter
    ): Promise<void> {
        const res = this.validate(request);

        let errors = res.errors;

        if (!res.errors) {
            const property = await this.propertyRepository.getPropertyById(
                res.parsedRequest.propertyId
            );

            if (!property) {
                errors = {
                    propertyId: [
                        `The property with id '${res.parsedRequest.propertyId}' does not exists.`
                    ]
                };
            } else {
                errors = await this.checkIfCanRemoveRoom(
                    res.parsedRequest,
                    property
                );

                if (!errors) {
                    const roomToDelete = property.rooms.find(
                        r => r.id.toString() === res.parsedRequest.roomId
                    ) as Room;

                    if (
                        [
                            RoomType.BEDROOM,
                            RoomType.LIVING_ROOM,
                            RoomType.KITCHEN
                        ].includes(roomToDelete.type)
                    ) {
                        property.noOfRooms--;
                    }

                    property.rooms = property.rooms.filter(
                        r => r.id.toString() === res.parsedRequest.roomId
                    );

                    await this.propertyRepository.save(property);
                    await this.roomRepository.deleteRoom(
                        res.parsedRequest.roomId
                    );
                }
            }
        }

        presenter.present({
            errors
        });
    }

    async checkIfCanRemoveRoom(
        req: RemoveRoomFromPropertyRequest,
        property: Property
    ) {
        // user should be the owner of the repository
        if (property.owner.id.toString() !== req.userId) {
            return {
                userId: [
                    `This user is not the owner of the property and thus cannot remove a room to the property.`
                ]
            };
        }

        // the requested room should be included in the property
        const roomToDelete = property.rooms.find(
            r => r.id.toString() === req.roomId
        );

        if (!roomToDelete) {
            return {
                roomId: ['This room is not included in the property']
            };
        }

        // Cannot delete a bedroom if there is only one
        const noOfBedRooms = property.rooms.filter(
            r => r.type === RoomType.BEDROOM
        ).length;

        if (noOfBedRooms === 1 && roomToDelete.type === RoomType.BEDROOM) {
            return {
                roomId: [
                    'This room cannot be deleted because it is the last bedroom.'
                ]
            };
        }

        // Cannot remove room if there is at least one active listing
        const activeListings =
            await this.listingRepository.getActiveListingsForProperty(
                req.propertyId
            );

        if (activeListings.length > 0) {
            return {
                global: [
                    'You cannot remove a room from a property when there are active listings.'
                ]
            };
        }
    }

    validate(
        request: RemoveRoomFromPropertyRequest
    ): ValidateResult<RemoveRoomFromPropertyRequest> {
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
