import {
    PropertyRepositoryBuilder,
    UserRepositoryBuilder,
    Uuid,
    Role,
    CreatePropertyUseCase
} from '@locaci/domain';

import type {
    CreatePropertyRequest,
    CreatePropertyResponse
} from '@locaci/domain';
import type { User } from '@prisma/client';
import type { Context } from './../../context';

export class CreatePropertyController {
    static async handle({
        input,
        ctx
    }: {
        ctx: Omit<Context, 'user'> & {
            user: User;
        };
        input: CreatePropertyRequest;
    }) {
        const propertyRepository = new PropertyRepositoryBuilder()
            .withSave(async p => {
                // TODO
                // await ctx.prisma.property.create({
                //     data: {
                //         userId: ctx.user.id,
                //         rentType: p.rentType
                //     }
                // });
            })
            .build();
        const userRepository = new UserRepositoryBuilder()
            .withGetUserById(async () => {
                return {
                    ...ctx.user,
                    id: new Uuid(ctx.user.id),
                    role: Role[ctx.user.role]
                };
            })
            .build();

        const useCase = new CreatePropertyUseCase(
            propertyRepository,
            userRepository
        );

        let res: CreatePropertyResponse;

        await useCase.execute(
            {
                ...input,
                ownerId: ctx.user.id
            },
            {
                present(response) {
                    res = response;
                }
            }
        );

        return res!;
    }
}
