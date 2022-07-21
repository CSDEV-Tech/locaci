import {
    AddRoomToPropertyRequest,
    AddRoomToPropertyRequestSchema
} from './AddRoomToPropertyRequest';
import { AddRoomToPropertyPresenter } from './AddRoomToPropertyPresenter';
import { ValidateResult } from './../../lib/types';
import { PropertyRepository } from './../../entities/Property';
import { Uuid } from '../../Dto';
import { Room, RoomRepository, RoomType } from '../../entities/Room';

export class AddRoomToPropertyUseCase {
    schema = AddRoomToPropertyRequestSchema;

    constructor(
        private propertyRepository: PropertyRepository,
        private roomRepository: RoomRepository
    ) {}

    async execute(
        request: AddRoomToPropertyRequest,
        presenter: AddRoomToPropertyPresenter
    ): Promise<void> {
        let res = this.validate(request);

        let errors = res.errors;
        let roomAdded: Room | null = null;

        if (!res.errors) {
            const property = await this.propertyRepository.getPropertyById(
                res.parsedRequest.propertyId
            );

            if (property) {
                roomAdded = {
                    id: new Uuid().toString(),
                    type: res.parsedRequest.roomType
                };

                property.rooms.push(roomAdded);

                if (
                    [
                        RoomType.BEDROOM,
                        RoomType.LIVING_ROOM,
                        RoomType.KITCHEN
                    ].includes(res.parsedRequest.roomType)
                ) {
                    property.noOfRooms++;
                }

                await this.propertyRepository.save(property);
                await this.roomRepository.save(roomAdded);
            } else {
                errors = {
                    propertyId: [
                        `The property with id '${res.parsedRequest.propertyId}' does exists.`
                    ]
                };
            }
        }

        presenter.present({
            errors,
            room: roomAdded
        });
    }

    validate(
        request: AddRoomToPropertyRequest
    ): ValidateResult<AddRoomToPropertyRequest> {
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
