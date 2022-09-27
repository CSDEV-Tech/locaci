import { z } from 'zod';

/**
 * This schema is taken from the `CreatePropertyRequest` file in domain,
 * we repeat it here because we need to add some custom error messages for the frontend
 */
export const createPropertyRequestSchema = z.object({
    surfaceArea: z
        .number({
            required_error: 'Veuillez saisir la surface de votre logement'
        })
        .min(
            9,
            'La surface de votre logement ne peut pas être plus petite que 9 m²'
        ),
    rentType: z.enum(['LOCATION', 'SHARED_APPARTMENT', 'SHORT_TERM'], {
        invalid_type_error: 'Veuillez choisir le type de logement',
        required_error: 'Veuillez choisir le type de logement'
    }),
    communeUid: z
        .string({
            required_error:
                'Veuillez saisir la commune où est située votre logement',
            invalid_type_error: ''
        })
        .uuid('Veuillez saisir la commune où est située votre logement'),
    localityName: z
        .string({
            required_error:
                'Veuillez saisir le quartier où se trouve votre logement'
        })
        .min(1, 'Veuillez saisir le quartier où se trouve votre logement'),
    localityUid: z
        .string({
            required_error:
                'Veuillez saisir le quartier où se trouve votre logement'
        })
        .min(1, 'Veuillez saisir le quartier où se trouve votre logement'),
    cityUid: z
        .string({
            required_error:
                'Veuillez saisir la ville où se trouve votre logement'
        })
        .uuid('Veuillez saisir la ville où se trouve votre logement'),
    addressInstructions: z.string().optional(),

    longitude: z.number({
        required_error: 'Longitude requise'
    }),
    latitude: z.number({
        required_error: 'Latitude requise'
    }),
    boundingBox: z.object(
        {
            minLongitude: z.number({
                required_error: 'La position est requise'
            }),
            minLatitude: z.number({
                required_error: 'La position est requise'
            }),
            maxLongitude: z.number({
                required_error: 'La position est requise'
            }),
            maxLatitude: z.number({
                required_error: 'La position est requise'
            })
        },
        {
            required_error: 'La position est requise'
        }
    ),
    additionalRooms: z.array(
        z.object({
            type: z.enum([
                'BEDROOM',
                'LIVING_ROOM',
                'KITCHEN',
                'BATHROOM',
                'LAUNDRY',
                'ATTIC',
                'BASEMENT',
                'DINING_ROOM',
                'GARAGE',
                'BALCONY',
                'VERANDA',
                'TERRACE',
                'TOILET'
            ])
        })
    ),
    amenities: z.array(
        z.union([
            z.object({
                type: z.enum([
                    'HOT_WATER',
                    'CABLE',
                    'WIFI',
                    'TWIN_BED',
                    'RADIATOR'
                ])
            }),
            z.object({
                name: z.string().min(1)
            })
        ])
    )
});
