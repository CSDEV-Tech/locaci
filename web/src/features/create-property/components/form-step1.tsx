// components
import { Button, NumberInput, Select } from '@locaci/ui';
import { Controller } from 'react-hook-form';
import { CaretDoubleRight } from 'phosphor-react';

// utils
import { RentTypes } from '~/features/shared/types';
import { createPropertyRequestSchema } from '~/server/trpc/validation/property-schema';
import { useZodForm } from '~/features/shared/hooks/use-zod-form';

// types
import type { z } from 'zod';
export type Form1Values = Pick<
    z.TypeOf<typeof createPropertyRequestSchema>,
    'surfaceArea' | 'rentType'
>;

type FormStep1Props = {
    onSubmit: (values: Form1Values) => void;
    defaultValues: Partial<Form1Values>;
};

export function FormStep1(props: FormStep1Props) {
    const form = useZodForm({
        schema: createPropertyRequestSchema.pick({
            surfaceArea: true,
            rentType: true
        }),
        defaultValues: {
            ...props.defaultValues,
            surfaceArea: props.defaultValues?.surfaceArea ?? 9
        }
    });

    return (
        <>
            <div>
                <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                    Quel type de logement voulez-vous ajouter ?
                </h1>
            </div>
            <form
                className="flex flex-col items-stretch gap-4 px-6 md:m-auto md:w-[450px]"
                onSubmit={form.handleSubmit(variables =>
                    props.onSubmit(variables)
                )}>
                <div className="flex flex-col gap-4 text-lg">
                    <Controller
                        name="rentType"
                        control={form.control}
                        render={({
                            field: { ref, ...field },
                            formState: { errors }
                        }) => (
                            <Select
                                label="Type de logement"
                                {...field}
                                autoFocus
                                required
                                options={Object.entries(RentTypes).map(
                                    ([value, label]) => ({
                                        value,
                                        label
                                    })
                                )}
                                errorText={errors.rentType?.message}
                            />
                        )}
                    />
                    <Controller
                        name="surfaceArea"
                        control={form.control}
                        render={({
                            field: { ref, ...field },
                            formState: { errors }
                        }) => (
                            <NumberInput
                                {...field}
                                required
                                label={`Surface du logement`}
                                appendix={`m²`}
                                errorText={errors.surfaceArea?.message}
                            />
                        )}
                    />

                    <Button
                        type="submit"
                        variant="dark"
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
