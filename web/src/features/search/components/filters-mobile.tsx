'use client';
import * as React from 'react';
// components
import { Button } from '@locaci/ui/components/atoms/button';
import { SliderIcon } from '@locaci/ui/components/atoms/icons/slider';
import { Select } from '@locaci/ui/components/atoms/select';
import { ComboBox } from '@locaci/ui/components/molecules/combobox';
import { NumberInput } from '@locaci/ui/components/atoms/input';
import { CalendarInput } from '@locaci/ui/components/molecules/calendar-input';
import { XIcon } from '@locaci/ui/components/atoms/icons/x';
import { CheckboxGroup } from '@locaci/ui/components/molecules/checkbox-group';

// utils
import { useFilterStore } from '~/lib/store';
import { useRouter } from 'next/navigation';

import { clsx } from '@locaci/ui/lib/functions';
import { parseSearchParams } from '~/lib/functions';
import { useURLSearchParams } from '~/features/search/hooks/use-url-search-params';

// types
export type FiltersMobileProps = {
    defaultMunicipalities: { label: string; value: string }[];
};
import {
    AmenityType,
    AmenityTypes,
    PredefinedAmenityTypes,
    type RentType
} from '~/features/shared/types';

export function FiltersMobile({ defaultMunicipalities }: FiltersMobileProps) {
    const showFilterModal = useFilterStore(state => state.showFilterModal);
    return (
        <>
            <Button
                variant="primary"
                onClick={showFilterModal}
                renderTrailingIcon={cls => <SliderIcon className={cls} />}>
                Modifier les filtres
            </Button>

            <FilterModal defaultMunicipalities={defaultMunicipalities} />
        </>
    );
}

function FilterModal(props: Pick<FiltersMobileProps, 'defaultMunicipalities'>) {
    // initial state
    const filterStore = useFilterStore();
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
    const [maxNoOfBedRooms, setMaxNoOfBedRooms] = React.useState(
        searchParsed?.maxNoOfBedRooms ?? 0
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
        new Date(searchParsed?.availableFrom ?? new Date())
    );

    const [amenities, setAmenities] = React.useState<AmenityType[]>(
        searchParsed?.amenities ?? []
    );

    const filteredMunicipalities = props.defaultMunicipalities.filter(m =>
        m.label.toLowerCase().startsWith(municipalityQuery.toLocaleLowerCase())
    );

    // effects
    React.useEffect(() => {
        // Hide all elements from screen readers
        const elementsToHide = document.querySelectorAll(
            `main,header,footer,body`
        );
        for (let i = 0; i < elementsToHide.length; i++) {
            const element = elementsToHide[i];
            if (filterStore.showFilters) {
                element.setAttribute(`aria-hidden`, 'true');
                (element as HTMLElement).style.overflow = 'hidden';
            } else {
                element.removeAttribute('aria-hidden');
                (element as HTMLElement).style.removeProperty('overflow');
            }
        }
    }, [filterStore.showFilters]);

    return (
        <aside
            title="Terminé"
            className={clsx(
                'fixed inset-0 z-40 bg-white',
                'overflow-scroll p-4',
                'md:p-8 lg:hidden',
                'animate-translate-up',
                {
                    hidden: !filterStore.showFilters
                }
            )}>
            <div className="mx-auto flex max-w-[500px] flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold">
                        Modifiez votre recherche
                    </h2>

                    <Button
                        aria-label="Annuler"
                        square
                        variant="dark"
                        onClick={filterStore.closeFilterModal}
                        renderTrailingIcon={cls => (
                            <XIcon className={cls} weight="bold" />
                        )}
                    />
                </div>

                <form
                    action="/search"
                    className="flex flex-col justify-between gap-4"
                    onSubmit={e => {
                        e.preventDefault();

                        const searchParams = new URLSearchParams(
                            new FormData(e.currentTarget) as any
                        );
                        filterStore.closeFilterModal();
                        router.push(`/search?${searchParams.toString()}`);
                    }}>
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
                            options={filteredMunicipalities}
                        />

                        <Select
                            name="rentType"
                            className={clsx(`w-full`)}
                            label="type de logement"
                            value={rentType}
                            onChange={str => setRentType(str as RentType)}
                            options={[
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

                        <NumberInput
                            name="maxNoOfBedRooms"
                            min={1}
                            className={clsx()}
                            label="Nombre de chambres"
                            value={maxNoOfBedRooms}
                            labelIncrementButton={`Augmenter le nombre de pièces`}
                            labelDecrementButton={`Diminuer le nombre de pièces`}
                            onChange={setMaxNoOfBedRooms}
                            rootClassName={clsx(`w-full`)}
                            showButtons
                        />

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
                            minValue={new Date()}
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
                                    setAmenities(
                                        values as PredefinedAmenityTypes[]
                                    );
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

                    <div className="mx-auto flex items-center gap-4">
                        <Button
                            type="button"
                            onClick={() => filterStore.closeFilterModal()}>
                            Annuler
                        </Button>

                        <Button variant="primary" type={'submit'}>
                            Appliquer les filtres
                        </Button>
                    </div>
                </form>
            </div>
        </aside>
    );
}
