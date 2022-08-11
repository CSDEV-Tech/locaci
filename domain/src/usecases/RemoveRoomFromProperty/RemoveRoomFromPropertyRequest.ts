import { z } from 'zod';

export const RemoveRoomFromPropertyRequestSchema = z.object({
    propertyId: z.string().uuid(),
    userId: z.string().uuid(),
    roomId: z.string().uuid()
});

export type RemoveRoomFromPropertyRequest = z.infer<
    typeof RemoveRoomFromPropertyRequestSchema
>;
