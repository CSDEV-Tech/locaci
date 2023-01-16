'use client';

import * as React from 'react';

// components
import { Button } from '@locaci/ui/components/atoms/button';
import { CalendarInput } from '@locaci/ui/components/molecules/calendar-input';
import { Select } from '@locaci/ui/components/atoms/select';
import { NumberInput } from '@locaci/ui/components/atoms/input';
import { TextArea } from '@locaci/ui/components/atoms/textarea';
import { Controller } from 'react-hook-form';
import { CaretDoubleLeft, Check } from 'phosphor-react';

// utils
import { useZodForm } from '~/features/shared/hooks/use-zod-form';
import { convertDateToBeginOfDate } from '~/lib/functions';
import {
    updatePropertyStep8Schema,
    updatePropertyStep8SchemaWithoutUid
} from '~/lib/validation-schemas/property-schema';

// types
import type { z } from 'zod';
import type { RentType } from '@prisma/client';

export type FormStep8Values = Omit<
    z.TypeOf<typeof updatePropertyStep8Schema>,
    'uid'
>;

export type FormStep8Props = {
    onPreviousClick: () => void;
    onSubmit: (values: FormStep8Values) => void;
    defaultValues: Partial<FormStep8Values> & { rentType: RentType };
    isSubmitting: boolean;
    intent: 'draft' | 'edit';
};

export function FormStep8(props: FormStep8Props) {
    // form state
    const form = useZodForm({
        schema: updatePropertyStep8SchemaWithoutUid,
        defaultValues: {
            availableFrom:
                props.defaultValues.availableFrom ??
                convertDateToBeginOfDate(new Date()),
            agencyMonthsPaymentAdvance:
                props.defaultValues.agencyMonthsPaymentAdvance ?? 0,
            cautionMonthsPaymentAdvance:
                props.defaultValues.cautionMonthsPaymentAdvance ?? 0,
            housingFee: props.defaultValues.housingFee ?? 20_000,
            housingPeriod:
                props.defaultValues.housingPeriod ??
                props.defaultValues.rentType === 'SHORT_TERM'
                    ? 1
                    : 30,
            description: props.defaultValues.description,
            minAvailability:
                props.intent === 'draft'
                    ? new Date()
                    : props.defaultValues.availableFrom!
        }
    });

    return (
        <>
            <div>
                <h2 className="text-center text-2xl font-bold text-secondary">
                    8/8
                </h2>
                <h1 className="px-6 text-center text-2xl font-bold leading-normal md:text-3xl">
                    {props.intent === 'draft' ? (
                        <>Ajouter une annonce pour votre logement</>
                    ) : (
                        <>
                            Modifier les détails de l'annonce pour votre
                            logement
                        </>
                    )}
                </h1>
            </div>

            <form
                className="flex flex-col items-stretch gap-4 px-6 md:m-auto md:w-[500px]"
                onSubmit={form.handleSubmit(values => {
                    props.onSubmit(values);
                })}>
                {props.defaultValues.rentType === 'SHORT_TERM' ? (
                    <Controller
                        name="housingPeriod"
                        control={form.control}
                        render={({
                            field: { ref, ...field },
                            formState: { errors }
                        }) => (
                            <Select
                                required
                                label={`Période de facturation`}
                                {...field}
                                onChange={newVal => {
                                    field.onChange(Number(newVal));
                                }}
                                value={field.value?.toString()}
                                options={[
                                    {
                                        value: `1`,
                                        label: 'Quotidienne'
                                    },
                                    {
                                        value: `7`,
                                        label: 'Hebdomadaire'
                                    },
                                    {
                                        value: `30`,
                                        label: 'Mensuelle'
                                    }
                                ]}
                                errorText={errors.housingPeriod?.message}
                            />
                        )}
                    />
                ) : (
                    <>
                        <Controller
                            name="cautionMonthsPaymentAdvance"
                            control={form.control}
                            render={({
                                field: { ref, ...field },
                                formState: { errors }
                            }) => (
                                <NumberInput
                                    {...field}
                                    label={`Nombre de mois de caution`}
                                    showButtons
                                    errorText={
                                        errors.cautionMonthsPaymentAdvance
                                            ?.message
                                    }
                                />
                            )}
                        />

                        <Controller
                            name="agencyMonthsPaymentAdvance"
                            control={form.control}
                            render={({
                                field: { ref, ...field },
                                formState: { errors }
                            }) => (
                                <NumberInput
                                    {...field}
                                    label={`Nombre de mois d'agence`}
                                    showButtons
                                    errorText={
                                        errors.agencyMonthsPaymentAdvance
                                            ?.message
                                    }
                                />
                            )}
                        />
                    </>
                )}

                <Controller
                    name="housingFee"
                    control={form.control}
                    render={({
                        field: { ref, ...field },
                        formState: { errors }
                    }) => (
                        <NumberInput
                            {...field}
                            required
                            label={`Prix du logement`}
                            appendix={`FCFA`}
                            errorText={errors.housingFee?.message}
                        />
                    )}
                />

                <Controller
                    name="availableFrom"
                    control={form.control}
                    render={({
                        field: { ref, ...field },
                        formState: { errors }
                    }) => (
                        <CalendarInput
                            minValue={
                                props.intent === 'draft'
                                    ? new Date()
                                    : props.defaultValues.availableFrom
                            }
                            label={`Date de disponibilité`}
                            {...field}
                            errorText={errors.availableFrom?.message}
                        />
                    )}
                />

                <Controller
                    name="description"
                    control={form.control}
                    render={({
                        field: { ref, ...field },
                        formState: { errors }
                    }) => (
                        <TextArea
                            required
                            {...field}
                            label="Description de votre logement"
                            helpText={`Vendez votre logement, et donnez le plus d'informatins dessus`}
                            errorText={errors.description?.message}
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
                        variant="secondary"
                        className="w-full"
                        loading={props.isSubmitting}
                        renderTrailingIcon={cls => <Check className={cls} />}>
                        Terminer
                    </Button>
                </div>
            </form>
        </>
    );
}
