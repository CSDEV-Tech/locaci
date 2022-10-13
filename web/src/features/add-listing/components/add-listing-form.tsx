import * as React from 'react';

// components
import {
    Button,
    CalendarInput,
    NumberInput,
    Select,
    TextArea
} from '@locaci/ui';
import { Controller } from 'react-hook-form';

// utils
import { useZodForm } from '@/features/shared/hooks/use-zod-form';
import { addListingSchema } from '@/server/trpc/validation/listing-schema';
import { t } from '@/utils/trpc-rq-hooks';
import { useRouter } from 'next/router';
import { convertDateToBeginOfDate } from '@/utils/functions';

// types
export type AddListingFormProps = {};

export function AddListingForm({}: AddListingFormProps) {
    // Load property data
    const router = useRouter();
    const { uid } = router.query;
    const { data: property } = t.owner.property.getSingle.useQuery(
        {
            uid: uid as string
        },
        {
            suspense: true,
            useErrorBoundary: true
        }
    );

    // form state
    const maxNoOfBedRooms = property!.rooms.filter(
        r => r.type === 'BEDROOM'
    ).length;

    const form = useZodForm({
        schema: addListingSchema,
        defaultValues: {
            availableFrom: convertDateToBeginOfDate(new Date()),
            noOfFreeBedRooms: 1,
            agencyMonthsPaymentAdvance: 0,
            cautionMonthsPaymentAdvance: 0,
            housingFee: 20_000,
            housingPeriod: property?.rentType === 'SHORT_TERM' ? 1 : 30,
            maxNoOfBedRooms
        }
    });

    const mut = t.owner.property.addListing.useMutation();
    React.useEffect(() => {
        mut.mutate({ field: 'string' });
    }, []);

    console.log({ err: mut.error });

    return (
        <>
            <form
                className="flex flex-col items-stretch gap-4"
                onSubmit={form.handleSubmit(values => {
                    console.log({ values });
                })}>
                {property?.rentType === 'SHARED_APPARTMENT' && (
                    <Controller
                        name="noOfFreeBedRooms"
                        control={form.control}
                        render={({
                            field: { ref, ...field },
                            formState: { errors }
                        }) => (
                            <NumberInput
                                required
                                label={`Nombre de chambres disponibles`}
                                {...field}
                                min={1}
                                showButtons
                                errorText={errors.noOfFreeBedRooms?.message}
                            />
                        )}
                    />
                )}

                {property?.rentType === 'SHORT_TERM' && (
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
                )}

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
                                errors.cautionMonthsPaymentAdvance?.message
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
                                errors.agencyMonthsPaymentAdvance?.message
                            }
                        />
                    )}
                />

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

                <Button type="submit" variant="secondary">
                    Ajouter
                </Button>
            </form>
        </>
    );
}
