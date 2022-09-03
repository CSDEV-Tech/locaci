import { z } from 'zod';

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
