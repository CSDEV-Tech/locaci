import { z } from 'zod';
import { RentType } from '@locaci/domain';

/**
 * This schema is taken from the `CreatePropertyRequest` file in domain,
 * we repeat it here because we need to add some custom error messages for the frontend
 */
export const createPropertyRequestSchema = z.object({
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
    surfaceArea: z
        .number({
            required_error: 'Veuillez saisir la surface de votre logement'
        })
        .min(
            9,
            'La surface de votre logement ne peut pas être plus petite que 9 mètres carrés'
        ),
    commune: z
        .string({
            required_error:
                'Veuillez saisir la commune où est située votre logement'
        })
        .min(1, 'Veuillez saisir la commune où est située votre logement'),
    district: z
        .string({
            required_error:
                'Veuillez saisir le quartier où se trouve votre logement'
        })
        .min(1, 'Veuillez saisir le quartier où se trouve votre logement'),
    city: z
        .string({
            required_error:
                'Veuillez saisir la ville où se trouve votre logement'
        })
        .min(1, 'Veuillez saisir la ville où se trouve votre logement'),
    adresse: z.string().nullable(),
    rentType: z.nativeEnum(RentType, {
        invalid_type_error: 'Veuillez choisir le type de logement',
        required_error: 'Veuillez choisir le type de logement'
    })
});
