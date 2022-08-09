import { z } from 'zod';

export const AddImageToPropertyRequestSchema = z.object({
    path: z
        .string()
        .regex(/[a-z0-9\-]+/g)
        .min(1),
    userId: z.string().uuid(),
    propertyId: z.string().uuid()
});

export type AddImageToPropertyRequest = z.infer<
    typeof AddImageToPropertyRequestSchema
>;
