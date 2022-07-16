import { z } from 'zod';

export const CreatePropertyRequestSchema = z.object({
    // TODO: Request Args
});

export type CreatePropertyRequest = z.TypeOf<typeof CreatePropertyRequestSchema>;
