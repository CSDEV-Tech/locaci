import * as React from 'react';
// components

// utils
import { z } from 'zod';
import { createPropertyRequestSchema } from '@web/server/trpc/validation/property-schema';
import { useZodForm } from '@web/features/shared';
import { Button, DropZone } from '@locaci/ui';
import { CaretDoubleLeft, Check, UploadSimple } from 'phosphor-react';

// types
export type Form7Values = Pick<
    z.TypeOf<typeof createPropertyRequestSchema>,
    'images'
>;
export type FormStep7Props = {
    onPreviousClick: () => void;
    onSubmit: (values: Form7Values) => void;
    defaultValues: Partial<Form7Values>;
};

export function FormStep7(props: FormStep7Props) {
    const form = useZodForm({
        schema: createPropertyRequestSchema.pick({
            images: true
        }),
        defaultValues: {
            images: [],
            ...props.defaultValues
        }
    });

    const images = form.watch('images');

    return (
        <>
            <div>
                <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                    Ajoutez les images de votre logement
                </h1>

                <form
                    className="flex flex-col items-stretch gap-4 px-6"
                    onSubmit={form.handleSubmit(variables =>
                        props.onSubmit(variables)
                    )}>
                    <DropZone
                        label={'Ajouter une photo'}
                        className={`min-h-[400px]`}
                    />

                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="hollow"
                            className="w-full"
                            onClick={props.onPreviousClick}
                            renderLeadingIcon={cls => (
                                <CaretDoubleLeft className={cls} />
                            )}>
                            Précédent
                        </Button>

                        <Button
                            type="submit"
                            variant="secondary"
                            className="w-full"
                            renderTrailingIcon={cls => (
                                <Check className={cls} />
                            )}>
                            Terminer
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
