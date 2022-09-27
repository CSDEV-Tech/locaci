import * as React from 'react';

// components
import { CaretDoubleLeft, CaretDoubleRight } from 'phosphor-react';
import { Button, SearchAutocomplete, TextInput } from '@locaci/ui';

// utils
import { z } from 'zod';
import { createPropertyRequestSchema } from '@web/server/trpc/validation/property-schema';
import { useZodForm } from '@web/features/shared';
import { t } from '@web/utils/trpc-rq-hooks';

// types
export type Form2Values = Pick<
    z.TypeOf<typeof createPropertyRequestSchema>,
    'cityUid' | 'communeUid' | 'localityName' | 'localityUid'
>;

type FormStep2Props = {
    defaultValues: Partial<
        Form2Values & { localityQuery: string; municipalityQuery: string }
    >;
    onPreviousClick: () => void;
    onSubmit: (
        values: Form2Values & {
            localityQuery: string;
            municipalityQuery: string;
        }
    ) => void;
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
    const [municipalityQuery, setMunicipalityQuery] = React.useState(
        props.defaultValues.municipalityQuery ?? ''
    );

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
    const [localityQuery, setLocalityQuery] = React.useState(
        props.defaultValues.localityQuery ?? ''
    );

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
                    props.onSubmit({
                        ...variables,
                        localityQuery,
                        municipalityQuery
                    })
                )}>
                <div className="flex flex-col gap-4 text-lg">
                    <TextInput value="Abidjan" disabled label="Ville" />

                    <SearchAutocomplete
                        label="Commune"
                        value={form.watch('communeUid')}
                        onChange={(value, inputValue) => {
                            form.setValue('communeUid', value);
                            setMunicipalityQuery(inputValue);
                            form.resetField('localityName');
                        }}
                        onSearch={query => {
                            setMunicipalityQuery(query);
                        }}
                        initialQuery={municipalityQuery}
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
                        initialQuery={localityQuery}
                        required
                        onChange={(newValue, inputValue) => {
                            setLocalityQuery(inputValue);

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
