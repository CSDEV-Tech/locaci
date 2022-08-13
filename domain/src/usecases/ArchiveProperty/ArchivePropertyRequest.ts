import { z } from 'zod';

export const ArchivePropertyRequestSchema = z.object({
    userId: z.string().uuid(),
    propertyId: z.string().uuid()
});

export type ArchivePropertyRequest = z.infer<
    typeof ArchivePropertyRequestSchema
>;
