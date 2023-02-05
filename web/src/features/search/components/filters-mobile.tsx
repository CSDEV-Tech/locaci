'use client';
import * as React from 'react';
// components
import { Button } from '@locaci/ui/components/atoms/button';
import { SliderIcon } from '@locaci/ui/components/atoms/icons/slider';

// utils
import { useFilterStore } from '~/lib/store';
import { ResponsiveModal } from '~/features/shared/components/responsive-modal';
import { useRouter } from 'next/navigation';
import { RentType } from '~/features/shared/types';
import { Select } from '@locaci/ui/components/atoms/select';
import { clsx } from '@locaci/ui/lib/functions';
import { ComboBox } from '@locaci/ui/components/molecules/combobox';
import { NumberInput } from '@locaci/ui/components/atoms/input';
import { MagnifyIngGlassIcon } from '@locaci/ui/components/atoms/icons/magnifying-glass';

// types
export type FiltersMobileProps = {
    className?: string;
    defaultMunicipalities: { label: string; value: string }[];
};

export function FiltersMobile({
    className,
    defaultMunicipalities
}: FiltersMobileProps) {
    const showFilterModal = useFilterStore(state => state.showFilterModal);
    return (
        <>
            <Button
                variant="primary"
                onClick={showFilterModal}
                renderTrailingIcon={cls => <SliderIcon className={cls} />}>
                Modifier votre recherche
            </Button>

            <FilterModal defaultMunicipalities={defaultMunicipalities} />
        </>
    );
}

function FilterModal(props: Pick<FiltersMobileProps, 'defaultMunicipalities'>) {
    const state = useFilterStore();
    const router = useRouter();

    const [commune, setCommune] = React.useState<string | null>(
        state?.municipalityId ?? null
    );
    const [rentType, setRentType] = React.useState<RentType | null>(
        state?.rentType ?? null
    );
    const [maxPrice, setMaxPrice] = React.useState(50_000);
    const [noOfRooms, setNoOfRooms] = React.useState(1);
    const [municipalityQuery, setMunicipalityQuery] = React.useState(
        state?.municipalityQuery ?? ''
    );
    const filteredMunicipalities = props.defaultMunicipalities.filter(m =>
        m.label.toLowerCase().startsWith(municipalityQuery.toLocaleLowerCase())
    );

    return (
        <ResponsiveModal
            title="Terminé"
            onClose={() => state.closeFilterModal()}
            isOpen={state.showFilters}>
            <form
                action="/search"
                className="flex min-h-[80vh] flex-col justify-between gap-4 p-4 md:min-h-fit"
                onSubmit={e => {
                    e.preventDefault();
                    const queryString = new URLSearchParams(
                        new FormData(e.currentTarget) as any
                    );
                    React.startTransition(() => {
                        state.closeFilterModal();
                        router.push(`/search?${queryString.toString()}`);
                    });
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

                    <div className="flex items-center gap-4">
                        <NumberInput
                            name="noOfRooms"
                            min={1}
                            className={clsx()}
                            label="pièces min"
                            value={noOfRooms}
                            labelIncrementButton={`Augmenter le nombre de pièces`}
                            labelDecrementButton={`Diminuer le nombre de pièces`}
                            onChange={setNoOfRooms}
                            rootClassName={clsx(`w-full`)}
                        />

                        <NumberInput
                            name="noOfRooms"
                            min={1}
                            className={clsx()}
                            label="pièces max"
                            value={noOfRooms}
                            labelIncrementButton={`Augmenter le nombre de pièces`}
                            labelDecrementButton={`Diminuer le nombre de pièces`}
                            onChange={setNoOfRooms}
                            rootClassName={clsx(`w-full`)}
                        />
                    </div>

                    <NumberInput
                        name="maxNoOfBedRooms"
                        min={1}
                        className={clsx()}
                        label="pièces max"
                        value={noOfRooms}
                        labelIncrementButton={`Augmenter le nombre de pièces`}
                        labelDecrementButton={`Diminuer le nombre de pièces`}
                        onChange={setNoOfRooms}
                        rootClassName={clsx(`w-full`)}
                    />

                    <div className="flex items-center gap-4">
                        <NumberInput
                            name="minPrice"
                            className={clsx()}
                            label="Prix minimum"
                            value={maxPrice}
                            onChange={setMaxPrice}
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
                            value={maxPrice}
                            onChange={setMaxPrice}
                            rootClassName={clsx(`w-full`)}
                            appendix={'m²'}
                        />

                        <NumberInput
                            name="maxArea"
                            className={clsx()}
                            label="Surface maximum"
                            value={maxPrice}
                            onChange={setMaxPrice}
                            rootClassName={clsx(`w-full`)}
                            appendix={'m²'}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 ">
                    <Button
                        type="button"
                        onClick={() => state.closeFilterModal()}>
                        Annuler
                    </Button>

                    <Button variant="primary" type={'submit'}>
                        Appliquer
                    </Button>
                </div>
            </form>
        </ResponsiveModal>
    );
}
