import { z } from 'zod';
import { RentType } from '../../entities/Property';

export const UpdatePropertyInformationsRequestSchema = z.object({
    propertyId: z.string().uuid(),
    userId: z.string().uuid(),
    longitude: z.number(),
    latitude: z.number(),
    radius: z.number().min(0.01),
    surfaceArea: z.number().min(9),
    commune: z.string().min(1),
    district: z.string().min(1),
    city: z.string().min(1),
    adresse: z.string().nullable()
});

export type UpdatePropertyInformationsRequest = z.infer<
    typeof UpdatePropertyInformationsRequestSchema
>;
