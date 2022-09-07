import { z } from 'zod';
import { Civility } from '@prisma/client';

export const sendEmailLinkSchema = z.object({
    email: z
        .string({
            required_error: `Veuillez saisir une adresse email`
        })
        .email({
            message: `Veuillez saisir une adresse email invalide, ex: kouakou.kouadio@gmail.com`
        })
        .trim(),
    redirectTo: z.string().url()
});

export const updateNameAndProfileSchema = z.object({
    lastName: z
        .string({
            required_error: `Veuillez saisir votre nom de famille`
        })
        .min(1, 'Le nom de famille ne doit pas être vide'),
    firstName: z
        .string({
            required_error: `Veuillez saisir votre prénom`
        })
        .min(1, 'Le prénom ne doit pas être vide')
});

export const requestOwnerAccessSchema = z.object({
    lastName: z
        .string({
            required_error: `Veuillez saisir votre nom de famille`
        })
        .min(1, 'Le nom de famille ne doit pas être vide'),
    firstName: z
        .string({
            required_error: `Veuillez saisir votre prénom`
        })
        .min(1, 'Le prénom ne doit pas être vide'),
    civility: z.nativeEnum(Civility, {
        required_error: `Veuillez saisir votre civilité (Mme ou Mr)`
    }),
    email: z
        .string({
            required_error: `Veuillez saisir une adresse email`
        })
        .email({
            message: `Veuillez saisir une adresse email invalide, ex: kouakou.kouadio@gmail.com`
        }),
    phoneNumber: z.preprocess(
        val => {
            const newVal = String(val);
            return newVal.replace(/[ -]/g, '');
        },
        z
            .string({
                required_error: `Veuillez saisir votre numéro de téléphone`
            })
            .regex(
                /([+]?\d{3}?|)(\d{10})/g,
                `Veuillez saisir un numéro de téléphone valide, c'est-à-dire un numéro à 10 chiffres.  
                ex: +2250148351513, ou 0648351513`
            )
    )
});

export const refuseOwnerAccessSchema = z.object({
    uid: z.string().uuid(),
    reason: z
        .string({
            required_error:
                'Veuillez saisir la raison pour laquelle vous refusez cette requête.'
        })
        .min(
            1,
            'Veuillez saisir la raison pour laquelle vous refusez cette requête.'
        )
});
