import { Uuid } from './../../Dto/Uuid';
import {
    CreatePropertyRequest,
    CreatePropertyRequestSchema
} from './CreatePropertyRequest';
import { CreatePropertyPresenter } from './CreatePropertyPresenter';
import { UserRepository } from './../../entities/User';
import { PropertyRepository, Property } from './../../entities/Property';
import { ValidateResult } from './../../lib/types';
import { RoomType } from '../../entities/Room';

export class CreatePropertyUseCase {
    schema = CreatePropertyRequestSchema;

    constructor(
        private propertyRepository: PropertyRepository,
        private userRepository: UserRepository
    ) {}

    async execute(
        request: CreatePropertyRequest,
        presenter: CreatePropertyPresenter
    ): Promise<void> {
        let res = this.validate(request);

        let propertyCreated: Property | null = null;
        let errors = res.errors;

        if (!res.errors) {
            const owner = await this.userRepository.getUserById(
                res.parsedRequest.ownerId
            );

            if (owner) {
                propertyCreated = {
                    ...res.parsedRequest,
                    id: new Uuid().toString(),
                    position: {
                        longitude: res.parsedRequest.longitude,
                        latitude: res.parsedRequest.latitude,
                        radius: res.parsedRequest.radius
                    },
                    noOfRooms: 1,
                    owner,
                    rooms: [
                        {
                            id: new Uuid().toString(),
                            type: RoomType.BEDROOM
                        }
                    ],
                    images: [],
                    amenities: []
                };
                await this.propertyRepository.save(propertyCreated);
            } else {
                errors = {
                    ownerId: ['This user does not exists.']
                };
            }
        }

        presenter.present({
            errors: errors,
            property: propertyCreated
        });
    }

    validate(
        request: CreatePropertyRequest
    ): ValidateResult<CreatePropertyRequest> {
        // TODO : Validation Rules
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
