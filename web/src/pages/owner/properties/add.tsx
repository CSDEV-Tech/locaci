import * as React from 'react';

// components
import {
    Button,
    clsx,
    ComboBox,
    NumberInput,
    Progress,
    SearchAutocomplete,
    Select,
    TextInput
} from '@locaci/ui';
import { OwnerLayout } from '@web/components/layouts/owner-layout';
import { CaretDoubleLeft, CaretDoubleRight } from 'phosphor-react';

// utils
import { Controller } from 'react-hook-form';

// types
import { NextPageWithLayout } from '@web/pages/_app';
import { useZodForm } from '@web/hooks/use-zod-form';
import { createPropertyRequestSchema } from '@web/server/trpc/validation/property-schema';
import { z } from 'zod';
import { t } from '@web/utils/trpc-rq-hooks';
import { useDebouncedCallBack } from '@web/hooks/use-debounced-callback';

export type AddPropertyPageProps = {};

const AddPropertyPage: NextPageWithLayout<AddPropertyPageProps> = props => {
    const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);

    return (
        <section className="relative flex h-full items-center justify-center">
            <Progress
                value={(step / 3) * 100}
                min={0}
                max={100}
                className="!absolute top-0 left-0 right-0"
                variant="secondary"
            />
            <div
                className={clsx(
                    'flex h-full w-full flex-col',
                    'gap-14 px-6 pt-20 pb-10',
                    'md:m-auto md:h-auto md:w-[450px]'
                )}>
                {step === 1 && (
                    <FormStep1
                        defaultValues={{}}
                        onSubmit={v1 => {
                            console.log({ v1 });
                            setStep(2);
                        }}
                    />
                )}
                {step === 2 && (
                    <FormStep2
                        defaultValues={{}}
                        onSubmit={v2 => {
                            console.log({ v2 });
                            setStep(3);
                        }}
                        onPreviousClick={() => {
                            setStep(1);
                        }}
                    />
                )}
                {step === 3 && <FormStep3 />}
            </div>
        </section>
    );
};

type Form1Values = Pick<
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
                <h1 className="text-center text-2xl font-extrabold leading-normal md:text-3xl">
                    Quel type de logement voulez-vous ajouter ?
                </h1>
            </div>
            <form
                className="flex flex-col items-stretch gap-4"
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
                                options={[
                                    { value: 'LOCATION', label: 'Appartement' },
                                    {
                                        value: 'SHARED_APPARTMENT',
                                        label: 'Chambre en colocation'
                                    },
                                    {
                                        value: 'SHORT_TERM',
                                        label: 'Location court-séjour (meublée)'
                                    }
                                ]}
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

type Form2Values = Pick<
    z.TypeOf<typeof createPropertyRequestSchema>,
    'cityUid' | 'communeUid' | 'localityName'
>;

type FormStep2Props = {
    onSubmit: (values: Form2Values) => void;
    onPreviousClick: () => void;
    defaultValues: Partial<Form2Values>;
};

export function FormStep2(props: FormStep2Props) {
    // form state
    const form = useZodForm({
        schema: createPropertyRequestSchema.pick({
            cityUid: true,
            communeUid: true,
            localityName: true,
            localityUid: true
        }),
        defaultValues: {
            ...props.defaultValues
        }
    });

    // city
    const abidjanCityQuery = t.owner.property.searchCityByName.useQuery({
        name: 'Abidjan'
    });

    // fetch the data for abidjan
    if (abidjanCityQuery.data) {
        form.setValue('cityUid', abidjanCityQuery.data.id);
    }

    // municipality (or commune)
    const [municipalityQuery, setMunicipalityQuery] = React.useState('');

    const { data: municipalitiesList, isLoading: isSearchingMunicipalities } =
        t.owner.property.searchCommuneByName.useQuery(
            {
                name: municipalityQuery
            },
            {
                trpc: { abortOnUnmount: true }
            }
        );

    // locality
    const watchMunicipalityUid = form.watch('communeUid');
    const [localityQuery, setLocalityQuery] = React.useState('');

    const { data: localityList, isFetching: isSearchingLocalities } =
        t.owner.property.searchLocalityByName.useQuery(
            {
                name: localityQuery,
                communeUid: watchMunicipalityUid ?? ''
            },
            {
                enabled: !!watchMunicipalityUid,
                trpc: { abortOnUnmount: true }
            }
        );

    return (
        <>
            <div>
                <h1 className="text-center text-2xl font-extrabold leading-normal md:text-3xl">
                    Où se situe votre logement ?
                </h1>
            </div>
            <form
                className="flex flex-col items-stretch gap-4"
                onSubmit={form.handleSubmit(variables =>
                    props.onSubmit(variables)
                )}>
                <div className="flex flex-col gap-4 text-lg">
                    <TextInput value="Abidjan" disabled label="Ville" />

                    <SearchAutocomplete
                        label="Commune"
                        autoFocus
                        value={form.watch('communeUid')}
                        onChange={value => {
                            form.setValue('communeUid', value);
                            form.resetField('localityName');
                        }}
                        onSearch={query => {
                            setMunicipalityQuery(query);
                        }}
                        options={
                            municipalitiesList?.map(c => ({
                                label: c.name,
                                key: c.id
                            })) ?? []
                        }
                        isLoading={isSearchingMunicipalities}
                        errorText={form.formState.errors.communeUid?.message}
                    />

                    <SearchAutocomplete
                        label="Quartier"
                        value={form.watch('localityUid') ?? undefined}
                        onChange={newValue => {
                            form.setValue(
                                'localityName',
                                localityList?.find(l => l.id === newValue)
                                    ?.name ?? ''
                            );
                            form.setValue('localityUid', newValue);
                        }}
                        disabled={!watchMunicipalityUid}
                        // Force refresh when municipalityId changes
                        key={watchMunicipalityUid}
                        onSearch={query => {
                            setLocalityQuery(query);
                        }}
                        options={
                            localityList?.map(c => ({
                                label: c.name,
                                key: c.id
                            })) ?? []
                        }
                        isLoading={isSearchingLocalities}
                        errorText={form.formState.errors.localityName?.message}
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
                            loading={abidjanCityQuery.isLoading}
                            type="submit"
                            variant="dark"
                            className="w-full"
                            renderTrailingIcon={cls => (
                                <CaretDoubleRight className={cls} />
                            )}>
                            Suivant
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}

type FormStep3Props = {
    // ...
};

export function FormStep3() {
    return <></>;
}

export default AddPropertyPage;
AddPropertyPage.getLayout = function (page) {
    return (
        <OwnerLayout
            title="Ajouter une nouvelle propriété"
            breadcrumbItems={[
                {
                    href: `/owner`,
                    label: `Tableau de bord`
                },
                {
                    href: `/owner/properties`,
                    label: `Propriétés`
                },
                {
                    href: `/owner/properties/add`,
                    label: `Ajouter`
                }
            ]}>
            {page}
        </OwnerLayout>
    );
};
