import { z } from 'zod';

export const RemoveImageFromPropertyRequestSchema = z.object({
    propertyId: z.string().uuid(),
    userId: z.string().uuid(),
    imageId: z.string().uuid()
});

export type RemoveImageFromPropertyRequest = z.infer<
    typeof RemoveImageFromPropertyRequestSchema
>;
