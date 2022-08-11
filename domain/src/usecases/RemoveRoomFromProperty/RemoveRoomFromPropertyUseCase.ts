import {
    type RemoveRoomFromPropertyRequest,
    RemoveRoomFromPropertyRequestSchema
} from './RemoveRoomFromPropertyRequest';
import type { RemoveRoomFromPropertyPresenter } from './RemoveRoomFromPropertyPresenter';
import type { ValidateResult } from './../../lib/types';
import type { Property, PropertyRepository } from '../../entities/Property';
import { Room, RoomRepository, RoomType } from '../../entities/Room';

export class RemoveRoomFromPropertyUseCase {
    schema = RemoveRoomFromPropertyRequestSchema;

    constructor(
        private propertyRepository: PropertyRepository,
        private roomRepository: RoomRepository
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

            if (property) {
                if (property.owner.id.toString() === res.parsedRequest.userId) {
                    const roomToDelete = property.rooms.find(
                        r => r.id.toString() === res.parsedRequest.roomId
                    );

                    if (roomToDelete) {
                        const noOfBedRooms = property.rooms.filter(
                            r => r.type === RoomType.BEDROOM
                        ).length;

                        if (
                            noOfBedRooms === 1 &&
                            roomToDelete.type === RoomType.BEDROOM
                        ) {
                            errors = {
                                roomId: [
                                    'This room cannot be deleted because it is the last bedroom.'
                                ]
                            };
                        } else {
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
                                r =>
                                    r.id.toString() === res.parsedRequest.roomId
                            );

                            await this.propertyRepository.save(property);
                            await this.roomRepository.deleteRoom(
                                res.parsedRequest.roomId
                            );
                        }
                    } else {
                        errors = {
                            roomId: [
                                'This room is not included in the property'
                            ]
                        };
                    }
                } else {
                    errors = {
                        userId: [
                            `This user is not the owner of the property and thus cannot remove a room to the property.`
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
