'use client';
import * as React from 'react';
// components
import { Select } from '@locaci/ui/components/atoms/select';
import { NumberInput } from '@locaci/ui/components/atoms/input';
import { Button } from '@locaci/ui/components/atoms/button';
import { MagnifyIngGlassIcon } from '@locaci/ui/components/atoms/icons/magnifying-glass';
import { ComboBox } from '@locaci/ui/components/molecules/combobox';

// utils
import { clsx } from '@locaci/ui/lib/functions';
import { useRouter, useSearchParams } from 'next/navigation';

// types
import type { RentType } from '~/features/shared/types';

export type SearchBarProps = {
    className?: string;
    defaultMunicipalities: { label: string; value: string }[];
    minimalStyle?: boolean;
    defaultValues?: {
        rentType?: RentType | null;
        municipalityValue?: string | null;
        municipalityQuery?: string | null;
    };
};

export function SearchBar({
    className,
    defaultMunicipalities,
    minimalStyle = false,
    defaultValues
}: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [commune, setCommune] = React.useState<string | null>(
        defaultValues?.municipalityValue ?? null
    );
    const [rentType, setRentType] = React.useState<RentType | null>(
        defaultValues?.rentType ?? null
    );
    const [maxPrice, setMaxPrice] = React.useState(50_000);
    const [maxNoOfRooms, setMaxNoOfRooms] = React.useState(1);
    const [municipalityQuery, setMunicipalityQuery] = React.useState(
        defaultValues?.municipalityQuery ?? ''
    );
    const filteredMunicipalities = defaultMunicipalities.filter(m =>
        m.label.toLowerCase().startsWith(municipalityQuery.toLocaleLowerCase())
    );

    React.useEffect(() => {
        const municipalitySearchQuery = searchParams.get(
            'municipalityId[label]'
        );
        const municipalityId = searchParams.get('municipalityId[value]');

        if (
            municipalitySearchQuery &&
            municipalityQuery !== municipalitySearchQuery
        ) {
            setMunicipalityQuery(municipalitySearchQuery ?? '');
        }

        if (municipalityId && commune !== municipalityId) {
            setCommune(municipalityId ?? '');
        }
    }, [searchParams]);

    return (
        <form
            action="/search"
            className={clsx(
                className,
                'relative z-[25] flex flex-col gap-2 rounded-md bg-white p-6',
                'lg:flex lg:flex-row lg:items-stretch lg:gap-0 lg:p-0',
                // this is to prevent a bug with the combobox not taking all the available parent height
                'lg:h-[60px]'
            )}
            onSubmit={e => {
                e.preventDefault();
                const queryString = new URLSearchParams(
                    new FormData(e.currentTarget) as any
                );
                router.push(`/search?${queryString.toString()}`);
            }}>
            <ComboBox
                inputClassName={clsx(
                    'w-full rounded-none !border-0 !pb-0',
                    `lg:rounded-md lg:rounded-r-none lg:!border lg:h-full`
                )}
                className={`lg:h-full lg:w-[250px]`}
                inputRootClassName={`lg:h-full`}
                name="municipalityId"
                label="Commune"
                value={commune}
                onSearch={query => {
                    setMunicipalityQuery(query);
                }}
                onChange={setCommune}
                options={[
                    ...filteredMunicipalities,
                    {
                        label: 'Toutes les régions',
                        value: null
                    }
                ]}
            />

            <Select
                name="rentType"
                className={clsx(
                    `w-full rounded-none !border-0 !border-t !pb-0 `,
                    `lg:rounded-md lg:rounded-l-none lg:rounded-r-none`,
                    `lg:h-full lg:w-[250px] lg:!border`
                )}
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

            {!minimalStyle ? (
                <>
                    <NumberInput
                        name="maxNoOfRooms"
                        required
                        min={1}
                        className={clsx(
                            'rounded-none !border-0 !border-t',
                            'lg:rounded-md lg:rounded-l-none lg:rounded-r-none',
                            'lg:h-full lg:!border'
                        )}
                        label="Nombre de pièces"
                        value={maxNoOfRooms}
                        labelIncrementButton={`Augmenter le nombre de pièces`}
                        labelDecrementButton={`Diminuer le nombre de pièces`}
                        onChange={setMaxNoOfRooms}
                        rootClassName={clsx(`w-full`, `lg:w-[220px]`)}
                        showButtons
                    />
                    <NumberInput
                        name="maxPrice"
                        required
                        className={clsx(
                            'rounded-none !border-0 !border-t',
                            'lg:h-full lg:rounded-md lg:rounded-l-none lg:!border'
                        )}
                        label="Prix maximum"
                        value={maxPrice}
                        onChange={setMaxPrice}
                        rootClassName={clsx(`w-full`, `lg:w-[220px]`)}
                        appendix={
                            <div className="flex items-center gap-2">
                                <span>FCFA</span>
                                <Button
                                    type="submit"
                                    className="hidden lg:flex"
                                    aria-label="Appliquer les filtres de logement"
                                    variant="primary"
                                    square
                                    renderLeadingIcon={cls => (
                                        <MagnifyIngGlassIcon className={cls} />
                                    )}
                                />
                            </div>
                        }
                    />
                </>
            ) : (
                <Button
                    variant="dark"
                    className="rounded-l-none"
                    renderTrailingIcon={cls => (
                        <MagnifyIngGlassIcon className={cls} weight="bold" />
                    )}>
                    Rechercher
                </Button>
            )}

            <Button
                variant="primary"
                className="lg:hidden"
                renderTrailingIcon={cls => (
                    <MagnifyIngGlassIcon className={cls} />
                )}>
                Rechercher
            </Button>
        </form>
    );
}
