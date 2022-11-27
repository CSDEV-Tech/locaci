'use client';

// components
import { Select } from '@locaci/ui/components/atoms/select';
import { NumberInput } from '@locaci/ui/components/atoms/input';
import { Button } from '@locaci/ui/components/atoms/button';
import { Controller } from 'react-hook-form';
import { CaretDoubleRight } from 'phosphor-react';

// utils
import { RentTypes } from '~/features/shared/types';
import { updatePropertyStep1Schema } from '~/server/trpc/validation/property-schema';
import { useZodForm } from '~/features/shared/hooks/use-zod-form';

// types
import type { z } from 'zod';

export type Form1Values = Omit<
    z.TypeOf<typeof updatePropertyStep1Schema>,
    'uid'
>;

type FormStep1Props = {
    onSubmit?: (values: Form1Values) => void;
    defaultValues?: Partial<Form1Values>;
    isSubmitting: boolean;
};

export function FormStep1(props: FormStep1Props) {
    const form = useZodForm({
        schema: updatePropertyStep1Schema.omit({
            uid: true
        }),
        defaultValues: {
            ...props.defaultValues
        }
    });

    return (
        <>
            <div>
                <h2 className="text-center text-2xl font-extrabold text-secondary">
                    1/8
                </h2>
                <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                    Quel type de logement voulez-vous ajouter ?
                </h1>
            </div>
            <form
                className="flex flex-col items-stretch gap-4 px-6 md:m-auto md:w-[450px]"
                onSubmit={form.handleSubmit(variables =>
                    props.onSubmit?.(variables)
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
                        loading={props.isSubmitting}
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
