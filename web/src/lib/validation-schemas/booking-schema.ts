import { z } from 'zod';
import { convertDateToBeginOfDate } from '~/lib/functions';

export const bookPropertySchema = z.object({
    uid: z.string().uuid(),
    firstName: z
        .string({
            required_error:
                'Veuillez remplir ce champ pour pouvoir faire la réservation'
        })
        .min(1, 'Veuillez remplir ce champ pour pouvoir faire la réservation'),
    lastName: z
        .string({
            required_error:
                'Veuillez remplir ce champ pour pouvoir faire la réservation'
        })
        .min(1, 'Veuillez remplir ce champ pour pouvoir faire la réservation'),
    phoneNumber: z.preprocess(
        val => {
            return String(val).replace(/[ -]/g, '');
        },
        z
            .string({
                required_error: `Veuillez saisir votre numéro de téléphone`
            })
            .regex(
                /^([+]?\d{3}?|)(\d{10})$/,
                `Veuillez saisir un numéro de téléphone valide, c'est-à-dire un numéro à 10 chiffres.  
                    ex: +2250148351513, ou 0648351513`
            )
    ),
    bookingDate: z
        .date({
            required_error: `Veuillez saisir une date de réservation`
        })
        .refine(
            date =>
                convertDateToBeginOfDate(date) >=
                convertDateToBeginOfDate(new Date()),
            'La date de disponibilité doit être dans le futur'
        )
});
