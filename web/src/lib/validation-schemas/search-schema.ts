import { AmenityTypesArray, RentTypesArray } from '~/features/shared/types';
import { z } from 'zod';

const MAX_NUMBER_VALUE = 999_999_999_999;

export const searchSchema = z.object({
    page: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().catch(1)
        )
        .optional()
        .default(1),
    minNoOfRooms: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().catch(1)
        )
        .optional()
        .default(1),
    maxNoOfRooms: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().catch(MAX_NUMBER_VALUE)
        )
        .optional(),
    maxNoOfBedRooms: z
        .preprocess(
            (arg: any) => Number(arg),
            z.number().catch(MAX_NUMBER_VALUE)
        )
        .optional(),
    minPrice: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().catch(0)
        )
        .optional(),
    maxPrice: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().catch(MAX_NUMBER_VALUE)
        )
        .optional(),
    minArea: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().catch(0)
        )
        .optional(),
    maxArea: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().catch(MAX_NUMBER_VALUE)
        )
        .optional(),
    rentType: z.enum(RentTypesArray).catch('LOCATION').optional(),
    municipalityId: z.string().optional(),
    view: z.enum(['MAP', 'LIST']).catch('LIST').optional(),
    availableFrom: z
        .string()
        .datetime()
        .catch(new Date(0).toISOString())
        .optional(),
    amenities: z
        .preprocess((arg: any) => {
            if (Array.isArray(arg)) {
                return arg.filter(v => AmenityTypesArray.includes(v));
            } else if (typeof arg === 'string') {
                return [arg];
            } else {
                return arg;
            }
        }, z.array(z.enum(AmenityTypesArray)).catch([]))
        .optional()
});
