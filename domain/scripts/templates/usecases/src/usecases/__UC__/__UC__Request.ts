import { z } from 'zod';

export const __UC__RequestSchema = z.object({
    // TODO: Request Args
});

export type __UC__Request = z.infer<typeof __UC__RequestSchema>;
