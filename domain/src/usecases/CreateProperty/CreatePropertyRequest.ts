import { RentType } from './../../entities/Property';
import { z } from 'zod';

export const CreatePropertyRequestSchema = z.object({
    longitude: z.number(),
    latitude: z.number(),
    radius: z.number().min(0.01),
    rentType: z.nativeEnum(RentType),
    surfaceArea: z.number().min(9),
    commune: z.string().min(1),
    district: z.string().min(1),
    city: z.string().min(1),
    adresse: z.string().nullable(),
    ownerId: z.string().uuid()
});

export type CreatePropertyRequest = z.infer<typeof CreatePropertyRequestSchema>;
