import * as React from 'react';

// components
import { Button } from '@locaci/ui/components/atoms/button';
import { ComboBox } from '@locaci/ui/components/molecules/combobox';
import { Select } from '@locaci/ui/components/atoms/select';
import { NumberInput } from '@locaci/ui/components/atoms/input';
import { CalendarInput } from '@locaci/ui/components/molecules/calendar-input';
import { CheckboxGroup } from '@locaci/ui/components/molecules/checkbox-group';

// utils
import { clsx } from '@locaci/ui/lib/functions';
import { useURLSearchParams } from '../hooks/use-url-search-params';
import { parseSearchParams } from '~/lib/functions';
import { useRouter } from 'next/navigation';

// types
import {
    AmenityTypes,
    PredefinedAmenityTypes,
    type AmenityType,
    type RentType
} from '~/features/shared/types';

export type FiltersFormProps = {
    defaultMunicipalities: { label: string; value: string }[];
    onSubmit: () => void;
    className?: string;
    hideButtons?: boolean;
    formId?: string;
};

export function FiltersForm({
    defaultMunicipalities,
    className,
    hideButtons,
    formId,
    onSubmit
}: FiltersFormProps) {
    // initial state
    const router = useRouter();
    const searchParams = useURLSearchParams();
    const searchParsed = parseSearchParams(searchParams);

    // states
    const [commune, setCommune] = React.useState<string | null>(
        searchParsed?.municipalityId ?? null
    );
    const [rentType, setRentType] = React.useState<RentType | null>(
        searchParsed?.rentType ?? null
    );
    const [minNoOfBedRooms, setMinNoOfBedRooms] = React.useState(
        searchParsed?.minNoOfBedRooms ?? 0
    );
    const [maxNoOfBedRooms, setMaxNoOfBedRooms] = React.useState(
        searchParsed?.maxNoOfBedRooms ?? 10
    );

    const [minPrice, setMinPrice] = React.useState(searchParsed?.minPrice ?? 0);
    const [maxPrice, setMaxPrice] = React.useState(
        searchParsed?.maxPrice ?? 50_000
    );

    const [minArea, setMinArea] = React.useState(searchParsed?.minArea ?? 9);
    const [maxArea, setMaxArea] = React.useState(searchParsed?.maxArea ?? 100);

    const [minNoOfRooms, setMinNoOfRooms] = React.useState(
        searchParsed?.minNoOfRooms ?? 1
    );
    const [maxNoOfRooms, setMaxNoOfRooms] = React.useState(
        searchParsed?.maxNoOfRooms ?? 5
    );
    const [municipalityQuery, setMunicipalityQuery] = React.useState(
        searchParsed?.municipalityQuery ?? ''
    );
    const [availableFrom, setAvailableFrom] = React.useState(
        new Date(searchParsed?.availableFrom ?? new Date(0))
    );

    const [amenities, setAmenities] = React.useState<AmenityType[]>(
        searchParsed?.amenities ?? []
    );

    const filteredMunicipalities = defaultMunicipalities.filter(m =>
        m.label.toLowerCase().startsWith(municipalityQuery.toLocaleLowerCase())
    );

    return (
        <form
            action="/search"
            id={formId}
            className={clsx(className, 'flex flex-col justify-between gap-4')}
            onSubmit={e => {
                e.preventDefault();

                const searchParams = new URLSearchParams(
                    new FormData(e.currentTarget) as any
                );
                router.push(`/search?${searchParams.toString()}`);
                onSubmit();
            }}>
            <input
                type="hidden"
                name="view"
                value={searchParsed.view ?? 'LIST'}
            />

            <div className="flex flex-col gap-4">
                <ComboBox
                    inputClassName={clsx('w-full')}
                    name="municipalityId"
                    label="Commune"
                    value={commune}
                    onSearch={query => {
                        setMunicipalityQuery(query);
                    }}
                    onChange={setCommune}
                    options={[
                        {
                            label: 'Toutes les régions',
                            value: null
                        },
                        ...filteredMunicipalities
                    ]}
                />

                <Select
                    name="rentType"
                    className={clsx(`w-full`)}
                    label="type de logement"
                    value={rentType}
                    onChange={str => setRentType(str as RentType)}
                    options={[
                        {
                            label: 'Tous types',
                            value: null
                        },
                        {
                            label: 'Colocation',
                            value: 'SHARED_APPARTMENT'
                        },
                        {
                            label: 'Location',
                            value: 'LOCATION'
                        },
                        {
                            label: 'Court Séjour',
                            value: 'SHORT_TERM'
                        }
                    ]}
                />

                <div className="flex items-center gap-4">
                    <NumberInput
                        name="minNoOfBedRooms"
                        min={1}
                        className={clsx()}
                        label="Chambres min"
                        value={minNoOfBedRooms}
                        onChange={setMinNoOfBedRooms}
                        rootClassName={clsx(`w-full`)}
                    />
                    <NumberInput
                        name="maxNoOfBedRooms"
                        min={1}
                        className={clsx()}
                        label="Chambres max"
                        value={maxNoOfBedRooms}
                        onChange={setMaxNoOfBedRooms}
                        rootClassName={clsx(`w-full`)}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <NumberInput
                        name="minNoOfRooms"
                        min={1}
                        className={clsx()}
                        label="pièces minimum"
                        value={minNoOfRooms}
                        labelIncrementButton={`Augmenter le nombre de pièces`}
                        labelDecrementButton={`Diminuer le nombre de pièces`}
                        onChange={setMinNoOfRooms}
                        rootClassName={clsx(`w-full`)}
                    />

                    <NumberInput
                        name="maxNoOfRooms"
                        min={1}
                        className={clsx()}
                        label="pièces maximum"
                        value={maxNoOfRooms}
                        labelIncrementButton={`Augmenter le nombre de pièces`}
                        labelDecrementButton={`Diminuer le nombre de pièces`}
                        onChange={setMaxNoOfRooms}
                        rootClassName={clsx(`w-full`)}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <NumberInput
                        name="minPrice"
                        className={clsx()}
                        label="Prix minimum"
                        value={minPrice}
                        onChange={setMinPrice}
                        rootClassName={clsx(`w-full`)}
                        appendix={'FCFA'}
                    />

                    <NumberInput
                        name="maxPrice"
                        className={clsx()}
                        label="Prix maximum"
                        value={maxPrice}
                        onChange={setMaxPrice}
                        rootClassName={clsx(`w-full`)}
                        appendix={'FCFA'}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <NumberInput
                        name="minArea"
                        className={clsx()}
                        label="Surface minimum"
                        value={minArea}
                        onChange={setMinArea}
                        rootClassName={clsx(`w-full`)}
                        appendix={'m²'}
                    />

                    <NumberInput
                        name="maxArea"
                        className={clsx()}
                        label="Surface maximum"
                        value={maxArea}
                        onChange={setMaxArea}
                        rootClassName={clsx(`w-full`)}
                        appendix={'m²'}
                    />
                </div>

                <CalendarInput
                    minValue={new Date(0)}
                    label={`Date de disponibilité`}
                    name="availableFrom"
                    value={availableFrom}
                    onChange={setAvailableFrom}
                />

                {rentType === 'SHORT_TERM' && (
                    <CheckboxGroup
                        display="grid"
                        className="mb-8"
                        name="amenities"
                        onChange={values => {
                            setAmenities(values as PredefinedAmenityTypes[]);
                        }}
                        options={Object.entries(AmenityTypes).map(
                            ([key, value]) => ({
                                label: value,
                                value: key
                            })
                        )}
                        value={amenities}
                        label={'Accessoires Inclus'}
                        variant={'secondary'}
                    />
                )}
            </div>

            {!hideButtons && (
                <div className="mx-auto flex items-center gap-4">
                    <Button type="button" onClick={onSubmit}>
                        Annuler
                    </Button>

                    <Button variant="primary" type={'submit'}>
                        Appliquer les filtres
                    </Button>
                </div>
            )}
        </form>
    );
}
