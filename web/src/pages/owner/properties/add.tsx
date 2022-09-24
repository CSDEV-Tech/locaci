import * as React from 'react';

// components
import {
    Button,
    clsx,
    LoadingIndicator,
    NumberInput,
    Progress,
    SearchAutocomplete,
    Select,
    TextInput
} from '@locaci/ui';
import { OwnerLayout } from '@web/components/layouts/owner-layout';
import { CaretDoubleLeft, CaretDoubleRight } from 'phosphor-react';
import { Controller } from 'react-hook-form';

// utils
import { useZodForm } from '@web/hooks/use-zod-form';
import { createPropertyRequestSchema } from '@web/server/trpc/validation/property-schema';
import { t } from '@web/utils/trpc-rq-hooks';

// types
import type { z } from 'zod';
import type { NextPageWithLayout } from '@web/pages/_app';
import dynamic from 'next/dynamic';

export type AddPropertyPageProps = {};

// lazy load the map component
const Map = dynamic(() => import('@web/components/map'), {
    ssr: false,
    suspense: true
});

const AddPropertyPage: NextPageWithLayout<AddPropertyPageProps> = props => {
    const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);
    const [currentLocality, setCurrentLocality] = React.useState({
        name: '',
        id: ''
    });

    return (
        <section className="relative flex h-full items-center justify-center">
            <Progress
                value={(step / 4) * 100}
                min={0}
                max={100}
                className="!absolute top-0 left-0 right-0"
                variant="secondary"
            />
            <div
                className={clsx(
                    'flex h-full w-full flex-col',
                    'gap-14 pt-20 pb-10',
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
                            setCurrentLocality({
                                id: v2.localityUid,
                                name: v2.localityName
                            });
                            setStep(3);
                        }}
                        onPreviousClick={() => {
                            setStep(1);
                        }}
                    />
                )}
                {step === 3 && (
                    <FormStep3
                        localityUid={currentLocality.id}
                        localityName={currentLocality.name}
                        onPreviousClick={() => {
                            setStep(2);
                        }}
                    />
                )}
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
                <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                    Quel type de logement voulez-vous ajouter ?
                </h1>
            </div>
            <form
                className="flex flex-col items-stretch gap-4 px-6"
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
    'cityUid' | 'communeUid' | 'localityName' | 'localityUid'
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
                <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                    Où se situe votre logement ?
                </h1>
            </div>
            <form
                className="flex flex-col items-stretch gap-4 px-6"
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
    onPreviousClick: () => void;
    localityUid: string;
    localityName: string;
};

/**
 * A wrapper around the map loading
 * @param props
 * @returns
 */
function MapLoader(props: { localityUid: string }) {
    const { data } = t.owner.property.getLocalityData.useQuery(
        {
            localityId: props.localityUid
        },
        {
            suspense: true
        }
    );
    return <Map localityData={data} />;
}

export function FormStep3(props: FormStep3Props) {
    return (
        <>
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                        Est-ce que le placement du point sur la carte est
                        correct ?
                    </h1>

                    <h2 className="text-center text-lg text-gray">
                        Si ce n'est pas le cas, veuillez retourner à l'étape
                        précédente et changer de quartier ou commune
                    </h2>
                </div>

                <React.Suspense
                    fallback={
                        <div className="relative h-[25rem]  bg-primary-15">
                            <div className="absolute top-1/2 left-1/2 inline-flex -translate-y-1/2 -translate-x-1/2 items-center gap-2">
                                <LoadingIndicator className="h-4 w-4" />
                                <span>Chargement de la carte</span>
                            </div>
                        </div>
                    }>
                    <MapLoader localityUid={props.localityUid} />
                </React.Suspense>

                <div className="flex items-center gap-4 px-6">
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
                        type="button"
                        variant="dark"
                        className="w-full"
                        renderTrailingIcon={cls => (
                            <CaretDoubleRight className={cls} />
                        )}>
                        Suivant
                    </Button>
                </div>
            </div>
        </>
    );
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
