import {
    AmenityTypesArray,
    RentTypesArray,
    RoomTypesArray
} from '~/features/shared/types';
import { z } from 'zod';
import type { BoundingBox } from '~/lib/types';

export const MAX_NUMBER_VALUE = 999_999_999_999; /// 999 milliards
/**
 *  the city of abidjan coordinates.
 *  Got from OpenStreetMap : https://nominatim.openstreetmap.org/ui/details.html?osmtype=R&osmid=3377982&class=boundary
 * */
export const ABIDJAN_BOUNDING_BOX = [
    5.2208709, 5.6363268, -4.2940788, -3.7177411
] satisfies BoundingBox;

export const searchSchema = z.object({
    page: z
        .preprocess(
            (arg: any) => Number(arg.toString().replace(/[^\x00-\x7F ]/g, '')),
            z.number().min(1).catch(1)
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
    minNoOfBedRooms: z
        .preprocess((arg: any) => Number(arg), z.number().catch(0))
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
    municipalityId: z.string().min(1).nullish().catch(null),
    municipalityQuery: z.preprocess(arg => {
        return arg === 'Toutes les régions' ? '' : arg;
    }, z.string().min(1).nullish().catch(null)),
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
        .optional(),
    rooms: z
        .preprocess((arg: any) => {
            if (Array.isArray(arg)) {
                return arg.filter(v => RoomTypesArray.includes(v));
            } else if (typeof arg === 'string') {
                return [arg];
            } else {
                return arg;
            }
        }, z.array(z.enum(RoomTypesArray)).catch([]))
        .optional(),
    bbox: z
        .preprocess(
            (arg: any) => {
                if (typeof arg === 'string') {
                    return arg.split(',').slice(0, 4); // get only the 4 first coordinates
                }
                return arg;
            },
            z
                .tuple([
                    // South WEST
                    z.number(),
                    z.number(),

                    // North EAST
                    z.number(),
                    z.number()
                ])
                .catch(ABIDJAN_BOUNDING_BOX)
        )
        .nullish()
});
