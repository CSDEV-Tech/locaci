import * as React from 'react';
import { clsx } from '@locaci/ui/lib/functions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { apiFetch } from './functions';
import superjson from 'superjson';
import { AnyCase } from './types';

type Error<
    TSchema extends z.ZodObject<Record<string, ZodPrimitive>> = z.AnyZodObject
> = {
    form_errors?: string[] | undefined;
} & {
    [key in keyof z.TypeOf<TSchema>]: string[] | undefined;
};

type FormErrors<
    TSchema extends z.ZodObject<Record<string, ZodPrimitive>> = z.AnyZodObject
> = Partial<Error<TSchema>>;

type UseFormResult<
    TResult extends any,
    TSchema extends z.ZodObject<Record<string, ZodPrimitive>> = z.AnyZodObject
> = {
    Form: React.ComponentType<Omit<FormProps, 'onSubmit'>>;
    data: TResult | undefined;
    errors?: FormErrors<TSchema>;
    isSubmitting: boolean;
};
type ZodPrimitive =
    | z.ZodString
    | z.ZodNumber
    | z.ZodNull
    | z.ZodBoolean
    | z.ZodEnum<[string, ...Array<string>]>;

function isSuccessResponse<
    TResult extends any,
    TSchema extends z.ZodObject<Record<string, ZodPrimitive>>
>(
    response: (TResult | FormErrors<TSchema>) & {
        httpStatus: number;
    }
): response is TResult & {
    httpStatus: number;
} {
    return response.httpStatus === 200;
}

export function useForm<
    TResult extends unknown = any,
    TSchema extends z.ZodObject<Record<string, ZodPrimitive>> = z.AnyZodObject
>(zodSchema: TSchema): UseFormResult<TResult, TSchema> {
    // Build the schema
    let fieldErrorsSchema = Object.keys(zodSchema.shape).reduce(
        (previous, key) => {
            return {
                ...previous,
                [key as keyof z.infer<TSchema>]: z.array(z.string()).optional()
            };
        },
        {} as {
            [key in keyof z.infer<TSchema>]: z.ZodOptional<
                z.ZodArray<z.ZodString, 'many'>
            >;
        }
    );

    const formErrorsSchema = z.intersection(
        z.object({
            form_errors: z.array(z.string()).optional()
        }),
        z.object(fieldErrorsSchema)
    );

    // parse errors from querystring
    const searchParams = useSearchParams();
    let entries: FormErrors<TSchema> = {};
    const errorQS = searchParams.get('__formErrors');

    if (errorQS) {
        try {
            const json = superjson.parse<Record<string, any>>(errorQS);
            entries = formErrorsSchema.parse(json);
        } catch (error) {
            // parse failed, do nothing
        }
    }

    const router = useRouter();
    const [isRouting, startTransition] = React.useTransition();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [data, setData] = React.useState<TResult | undefined>(undefined);
    const path = usePathname() ?? '/';
    const [errors, setErrors] =
        React.useState<FormErrors<typeof zodSchema>>(entries);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formEntries = new FormData(form).entries();
        const json = Array.from(formEntries, ([key, value]) => ({
            [key]: value.valueOf()
        })).reduce((prev, obj) => ({
            ...prev,
            ...obj
        }));
        const redirectTo = json['__redirectTo'].toString() ?? path;

        const parseResult = zodSchema.safeParse(json);

        console.log({ json, parseResult });
        if (parseResult.success) {
            setErrors({});

            setIsSubmitting(true);
            const response = await apiFetch<
                TResult | FormErrors<typeof zodSchema>
            >(form.action, {
                method: form.method,
                body: JSON.stringify(parseResult.data)
            });

            setIsSubmitting(false);

            if (isSuccessResponse(response)) {
                switch (response.httpStatus) {
                    case 308:
                        startTransition(() => router.replace(redirectTo));
                        break;
                    case 302:
                        startTransition(() => router.push(redirectTo));
                        break;
                    default:
                        setData(response);
                        break;
                }
            } else {
                if (response.httpStatus === 400) {
                    setErrors({
                        ...response
                    });
                } else if (response.httpStatus === 500) {
                    // @ts-ignore
                    setErrors({
                        form_errors: ['Une erreur serveur est survenue!']
                    });
                }
            }
        } else {
            const flattenedZodErrors = parseResult.error.flatten();

            // Client side validation
            setErrors({
                ...(flattenedZodErrors.fieldErrors as FormErrors<
                    typeof zodSchema
                >),
                form_errors: flattenedZodErrors.formErrors
            });
        }
    };

    const currentForm = React.memo((props: Omit<FormProps, 'onSubmit'>) => (
        <Form {...props} onSubmit={handleSubmit} />
    ));

    return {
        Form: currentForm,
        data,
        errors,
        isSubmitting: isRouting || isSubmitting
    };
}

type FormProps = {
    className?: string;
    method?: AnyCase<'GET' | 'POST' | 'PUT' | 'DELETE'>;
    action: string;
    children?: React.ReactNode;
    onSubmit?: (submitEvent: React.FormEvent<HTMLFormElement>) => void;
    // mutation ?? -> une mutation tRPC, mais à savoir si c'est possible
    redirectTo?: string; // l'URL de redirection, qui va créer un hidden input et que l'API pourra utiliser pour la redirection, si pas renseignée utiliser l'URL d'origine.
};

function Form(props: FormProps) {
    const redirectTo = props.redirectTo ?? usePathname() ?? '/';

    return (
        <form
            action={props.action}
            className={clsx(props.className)}
            method={props.method ?? 'GET'}
            onSubmit={props.onSubmit}>
            {props.redirectTo && (
                <input type="hidden" name="__redirectTo" value={redirectTo} />
            )}
            {props.children}
        </form>
    );
}

// // ** USAGE **
// function LoginForm() {
//     const auhSchema = z.object({
//         email: z.string(),
//         password: z.string()
//     });

//     const {
//         Form,
//         response: { data, isSubmitting, errors }
//     } = useForm(auhSchema);

//     return (
//         <Form
//             className="flex flex-col gap-4"
//             action="/api/auth/login"
//             redirectTo="/profile"
//             method="post">
//             <div>
//                 <label htmlFor="email">Saisissez votre email : </label>
//                 <input
//                     name="email"
//                     type="password"
//                     id="email"
//                     aria-describedby="error-email"
//                 />
//                 {errors?.email && (
//                     <ul id="error-email" aria-live="assertive">
//                         {errors.email.map((err, i) => (
//                             <li key={i}>{err}</li>
//                         ))}
//                     </ul>
//                 )}
//             </div>

//             <div>
//                 <label htmlFor="pass">Saisissez votre email:</label>
//                 <input
//                     name="password"
//                     type="password"
//                     id="pass"
//                     aria-describedby="error-pass"
//                 />
//                 {errors?.password && (
//                     <span id="error-pass" aria-live="assertive">
//                         {errors.password.map((err, i) => (
//                             <li key={i}>{err}</li>
//                         ))}
//                     </span>
//                 )}
//             </div>

//             <button type="submit">Valider</button>
//         </Form>
//     );
// }
