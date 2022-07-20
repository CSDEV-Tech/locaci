import {
    AddRoomToPropertyRequest,
    AddRoomToPropertyRequestSchema
} from './AddRoomToPropertyRequest';
import { AddRoomToPropertyPresenter } from './AddRoomToPropertyPresenter';
import { ValidateResult } from './../../lib/types';
import { PropertyRepository } from './../../entities/Property';
import { Uuid } from '../../Dto';
import { RoomType } from '../../entities/Room';

export class AddRoomToPropertyUseCase {
    schema = AddRoomToPropertyRequestSchema;

    constructor(private propertyRepository: PropertyRepository) {}

    async execute(
        request: AddRoomToPropertyRequest,
        presenter: AddRoomToPropertyPresenter
    ): Promise<void> {
        // TODO : UseCase Logic
        let res = this.validate(request);

        let errors = res.errors;

        if (!res.errors) {
            const property = await this.propertyRepository.getPropertyById(
                res.parsedRequest.propertyId
            );

            if (property) {
                property.rooms.push({
                    id: new Uuid().toString(),
                    type: res.parsedRequest.roomType
                });

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
