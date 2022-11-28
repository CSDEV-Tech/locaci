import { z } from 'zod';

export const updatePropertyStep1Schema = z.object({
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
    uid: z.string().uuid()
});

export const updatePropertyStep2Schema = z.object({
    uid: z.string().uuid(),
    municipalityUid: z
        .string({
            required_error:
                'Veuillez saisir la commune où est située votre logement',
            invalid_type_error: ''
        })
        .uuid('Veuillez saisir la commune où est située votre logement'),
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
    longitude: z.string({
        required_error: 'Longitude requise'
    }),
    latitude: z.string({
        required_error: 'Latitude requise'
    }),
    geoJSON: z.union(
        [
            z.object({
                type: z.literal(`Point`),
                coordinates: z.tuple([z.number(), z.number()])
            }),
            z.object({
                type: z.literal(`Polygon`),
                coordinates: z
                    .array(z.array(z.tuple([z.number(), z.number()])))
                    .min(1)
                    .max(1)
            })
        ],
        {
            required_error: 'La position est requise'
        }
    )
});

export const updatePropertyStep3Schema = z.object({
    addressInstructions: z.string().optional(),
    uid: z.string().uuid()
});

export const updatePropertyStep4Schema = z.object({
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
    uid: z.string().uuid()
});

export const updatePropertyStep5Schema = z.object({
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
                name: z.string().min(1, "Veuillez saisir un nom d'accessoire")
            })
        ])
    ),
    uid: z.string().uuid()
});

export const updatePropertyStep6Schema = z.object({
    images: z
        .array(
            z.object({
                uri: z.string().url(),
                path: z.string()
            })
        )
        .min(3, 'Vous devez ajouter au moins 3 images de votre logement'),
    uid: z.string().uuid()
});
