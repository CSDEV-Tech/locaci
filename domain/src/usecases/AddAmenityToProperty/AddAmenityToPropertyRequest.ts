import { z } from 'zod';
import { AmenityType } from '../../entities/Amenity';

const WithCustomNameSchema = z.object({
    name: z.string().min(1),
    type: z.literal(AmenityType.OTHER),
    propertyId: z.string().uuid(),
    userId: z.string().uuid()
});

const WithPredefinedNameSchema = z.object({
    type: z.enum([
        AmenityType.HOT_WATER,
        AmenityType.CABLE,
        AmenityType.WIFI,
        AmenityType.TWIN_BED,
        AmenityType.RADIATOR
    ]),
    propertyId: z.string().uuid(),
    userId: z.string().uuid()
});

export const AddAmenityToPropertyRequestSchema = z.union([
    WithCustomNameSchema,
    WithPredefinedNameSchema
]);

export type AddAmenityToPropertyRequest = z.infer<
    typeof AddAmenityToPropertyRequestSchema
>;
