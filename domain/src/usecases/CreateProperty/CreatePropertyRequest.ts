import { RentType } from './../../entities/Property';
import { z } from 'zod';

export const CreatePropertyRequestSchema = z.object({
    longitude: z.number(),
    latitude: z.number(),
    surfaceArea: z.number().min(9),
    commune: z.string().min(1),
    district: z.string().min(1),
    city: z.string().min(1),
    adresse: z.string().nullable(),
    rentType: z.nativeEnum(RentType),
    ownerId: z.string().uuid(),
    boundingBox: z.object({
        minLongitude: z.number(),
        minLatitude: z.number(),
        maxLongitude: z.number(),
        maxLatitude: z.number()
    })
});

export type CreatePropertyRequest = z.TypeOf<
    typeof CreatePropertyRequestSchema
>;
