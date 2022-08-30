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
