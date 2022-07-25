import { z } from 'zod';
import { RoomType } from '../../entities/Room';

export const AddRoomToPropertyRequestSchema = z.object({
    propertyId: z.string().uuid(),
    roomType: z.nativeEnum(RoomType),
    userId: z.string().uuid()
});

export type AddRoomToPropertyRequest = z.infer<
    typeof AddRoomToPropertyRequestSchema
>;
