import { convertDateToBeginOfDate } from '~/utils/functions';
import { z } from 'zod';

export const addListingSchema = z
    .object({
        description: z
            .string({
                required_error:
                    'Veuillez saisir une description pour votre logement'
            })
            .min(15, 'La description doit avoir au moins 15 caractères'),
        availableFrom: z
            .date()
            .refine(
                date =>
                    convertDateToBeginOfDate(date) >=
                    convertDateToBeginOfDate(new Date()),
                'La date de disponibilité doit être dans le futur'
            ),
        housingFee: z
            .number({
                required_error: 'Veuillez saisir un prix du logement'
            })
            .min(1, "Le prix d'un logement doit être supérieur à 0 FCFA"),
        housingPeriod: z
            .number()
            .min(1, 'La période de facturation doit être 1 jour ou plus')
            .optional(),
        noOfFreeBedRooms: z
            .number()
            .min(1, 'Le nombre de chambres disponibles doit être au minimum 1'),
        maxNoOfBedRooms: z.number().min(1),
        cautionMonthsPaymentAdvance: z
            .number()
            .min(0, 'Le nombre de mois de caution doit être positif')
            .optional(),
        agencyMonthsPaymentAdvance: z
            .number()
            .min(0, "Le nombre de mois d'agence doit être positif")
            .optional()
    })
    .refine(
        data => {
            return data.noOfFreeBedRooms <= data.maxNoOfBedRooms;
        },
        data => ({
            message: `Le nombre de chambre disponibles ne peut pas dépasser le nombre de chambres maximales (${data.maxNoOfBedRooms})`,
            path: ['noOfFreeBedRooms']
        })
    );
