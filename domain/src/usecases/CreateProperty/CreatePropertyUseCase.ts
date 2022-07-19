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
        // TODO : UseCase Logic
        let res = this.validate(request);

        let propertyCreated: Property | null = null;
        if (!res.errors) {
            const owner = await this.userRepository.getUserById(
                res.parsedRequest.ownerId
            );

            propertyCreated = {
                ...res.parsedRequest,
                position: {
                    longitude: res.parsedRequest.longitude,
                    latitude: res.parsedRequest.latitude,
                    radius: res.parsedRequest.radius
                },
                images: [],
                id: new Uuid().toString(),
                owner: owner!,
                rooms: [
                    {
                        id: new Uuid().toString(),
                        type: RoomType.BEDROOM
                    }
                ]
            };
            await this.propertyRepository.save(propertyCreated);
        }

        presenter.present({
            errors: res.errors,
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
