import * as React from 'react';
// components
import { Button, TextArea } from '@locaci/ui';
import { CaretDoubleLeft, CaretDoubleRight } from 'phosphor-react';
import { Controller } from 'react-hook-form';

// utils
import { createPropertyRequestSchema } from '@/server/trpc/validation/property-schema';
import { useZodForm } from '@/features/shared/hooks/use-zod-form';

// types
import type { z } from 'zod';
export type Form4Values = Pick<
    z.TypeOf<typeof createPropertyRequestSchema>,
    'addressInstructions'
>;

export type FormStep4Props = {
    onPreviousClick: () => void;
    onSubmit: (values: Form4Values) => void;
    defaultValues: Partial<Form4Values>;
};

export function FormStep4(props: FormStep4Props) {
    const form = useZodForm({
        schema: createPropertyRequestSchema.pick({
            addressInstructions: true
        }),
        defaultValues: {
            ...props.defaultValues
        }
    });

    return (
        <>
            <div>
                <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                    Précisions sur l'adresse
                </h1>

                <h2 className="text-center text-lg text-gray">
                    Pour que vos locataires se retrouvent plus facilement votre
                    logement
                </h2>
            </div>

            <form
                className="flex flex-col items-stretch gap-4 px-6 md:m-auto md:w-[450px]"
                onSubmit={form.handleSubmit(variables =>
                    props.onSubmit(variables)
                )}>
                <Controller
                    name="addressInstructions"
                    control={form.control}
                    render={({
                        field: { ref, ...field },
                        formState: { errors }
                    }) => (
                        <TextArea
                            {...field}
                            label={`Instructions pour l'adresse`}
                            rows={10}
                            helpText={`Ex: Situé 2e rue à gauche de l'immeuble de la RTI en partant vers le terminus`}
                            errorText={errors.addressInstructions?.message}
                        />
                    )}
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
                        variant="dark"
                        className="w-full"
                        renderTrailingIcon={cls => (
                            <CaretDoubleRight className={cls} />
                        )}>
                        Suivant
                    </Button>
                </div>
            </form>
        </>
    );
}
