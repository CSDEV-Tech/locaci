'use client';
import * as React from 'react';

// components
import { CaretDoubleLeft, CaretDoubleRight } from 'phosphor-react';
import { Button } from '@locaci/ui/components/atoms/button';
import { TextInput } from '@locaci/ui/components/atoms/input';
import { SearchAutocomplete } from '@locaci/ui/components/molecules/search-autocomplete';

// utils
import { updatePropertyStep2Schema } from '~/validation/property-schema';
import { useZodForm } from '~/features/shared/hooks/use-zod-form';
import { t } from '~/app/trpc-client-provider';
import { z } from 'zod';

// types
export type Form2Values = Pick<
    z.TypeOf<typeof updatePropertyStep2Schema>,
    | 'cityUid'
    | 'localityName'
    | 'municipalityUid'
    | 'localityOSMID'
    | 'boundingBox'
> & {
    municipalityQuery: string;
};

type FormStep2Props = {
    defaultValues: Partial<Form2Values>;
    onPreviousClick: () => void;
    onSubmit: (values: Form2Values) => void;
};

export function FormStep2(props: FormStep2Props) {
    // form state
    const form = useZodForm({
        schema: updatePropertyStep2Schema
            .pick({
                cityUid: true,
                localityName: true,
                municipalityUid: true,
                localityOSMID: true,
                boundingBox: true
            })
            .merge(
                z.object({
                    municipalityQuery: z.string()
                })
            ),
        defaultValues: {
            cityUid: props.defaultValues.cityUid,
            localityOSMID: props.defaultValues.localityOSMID,
            localityName: props.defaultValues.localityName,
            municipalityUid: props.defaultValues.municipalityUid,
            municipalityQuery: props.defaultValues.municipalityQuery,
            boundingBox: props.defaultValues.boundingBox
        }
    });

    // city
    const abidjanCityQuery = t.geo.searchCityByName.useQuery({
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
        t.geo.searchCommuneByName.useQuery(
            {
                name: municipalityQuery
            },
            {
                trpc: { abortOnUnmount: true }
            }
        );

    // locality
    const watchMunicipalityUid = form.watch('municipalityUid');
    const municipality = municipalitiesList?.find(
        m => m.id === watchMunicipalityUid
    );

    const [localityQuery, setLocalityQuery] = React.useState(
        props.defaultValues.localityName ?? ''
    );

    const { data: localityList, isFetching: isSearchingLocalities } =
        t.geo.searchLocalityByName.useQuery(
            {
                locality: localityQuery,
                municipality: municipality?.name ?? ''
            },
            {
                enabled: Boolean(municipality),
                trpc: { abortOnUnmount: true }
            }
        );

    return (
        <>
            <div>
                <h2 className="text-center text-2xl font-bold text-secondary">
                    2/8
                </h2>
                <h1 className="px-6 text-center text-2xl font-bold leading-normal md:text-3xl">
                    Où se situe votre logement ?
                </h1>
            </div>
            <form
                className="flex flex-col items-stretch gap-4 px-6 md:m-auto md:w-[450px]"
                onSubmit={form.handleSubmit(variables =>
                    props.onSubmit({
                        ...variables,
                        municipalityQuery
                    })
                )}>
                <div className="flex flex-col gap-4 text-lg">
                    <TextInput value="Abidjan" disabled label="Ville" />

                    <SearchAutocomplete
                        label="Commune"
                        value={form.watch('municipalityUid')}
                        onChange={(value, inputValue) => {
                            setMunicipalityQuery(inputValue);
                            setLocalityQuery('');

                            form.setValue('municipalityUid', value);
                            form.setValue('localityName', '');
                            form.setValue('localityOSMID', '');
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
                        errorText={
                            form.formState.errors.municipalityUid?.message
                        }
                    />

                    <SearchAutocomplete
                        label="Adresse"
                        value={form.watch('localityOSMID') ?? undefined}
                        initialQuery={localityQuery}
                        required
                        onChange={(newValue, inputValue) => {
                            setLocalityQuery(inputValue);
                            form.setValue('localityName', inputValue);
                            form.setValue('localityOSMID', newValue);

                            if (localityList) {
                                form.setValue(
                                    'boundingBox',
                                    localityList!.find(
                                        l => l.place_id.toString() === newValue
                                    )?.boundingbox!
                                );
                            }
                        }}
                        disabled={!watchMunicipalityUid}
                        // Force refresh when municipalityId changes
                        key={watchMunicipalityUid}
                        onSearch={query => {
                            setLocalityQuery(query);
                        }}
                        options={
                            localityList?.map(c => ({
                                label: c.display_name,
                                key: c.place_id.toString()
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
