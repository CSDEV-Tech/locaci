import { AmenityTypesArray, RentTypesArray } from '~/features/shared/types';
import { z } from 'zod';

const MAX_NUMBER_VALUE = 999_999_999_999;

export const searchSchema = z.object({
    page: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().catch(1)
        )
        .default(1)
        .nullish(),
    minNoOfRooms: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().catch(1)
        )
        .default(1)
        .nullish(),
    maxNoOfRooms: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().catch(MAX_NUMBER_VALUE)
        )
        .nullish(),
    maxNoOfBedRooms: z
        .preprocess(
            (arg: any) => Number(arg),
            z.number().catch(MAX_NUMBER_VALUE)
        )
        .nullish(),
    minPrice: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().catch(0)
        )
        .nullish(),
    maxPrice: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().catch(MAX_NUMBER_VALUE)
        )
        .nullish(),
    minArea: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().catch(0)
        )
        .nullish(),
    maxArea: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().catch(MAX_NUMBER_VALUE)
        )
        .nullish(),
    rentType: z.enum(RentTypesArray).catch('LOCATION').nullish(),
    municipalityId: z.string().nullish(),
    municipalityQuery: z.string().nullish(),
    view: z.enum(['MAP', 'LIST']).catch('LIST').nullish(),
    availableFrom: z
        .preprocess((arg: any) => new Date(arg), z.date().catch(new Date(0)))
        .nullish(),
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
