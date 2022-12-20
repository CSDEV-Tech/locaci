'use client';
import * as React from 'react';
import { clsx } from '@locaci/ui/lib/functions';
import { Select } from '@locaci/ui/components/atoms/select';
import { NumberInput } from '@locaci/ui/components/atoms/input';
import { Button } from '@locaci/ui/components/atoms/button';
import { MagnifyingGlass } from 'phosphor-react';
import { ComboBox } from '@locaci/ui/components/molecules/combobox';
import { useRouter } from 'next/navigation';

export type SearchBarProps = {
    className?: string;
    defaultMunicipalities: { label: string; value: string }[];
};

export function SearchBar({
    className,
    defaultMunicipalities
}: SearchBarProps) {
    const router = useRouter();

    const [commune, setCommune] = React.useState<string | null>(null);
    const [rentType, setRentType] = React.useState<string | undefined>(
        undefined
    );
    const [maxPrice, setMaxPrice] = React.useState(50_000);
    const [noOfRooms, setNoOfRooms] = React.useState(1);
    const [municipalityQuery, setMunicipalityQuery] = React.useState('');
    const filteredMunicipalities = defaultMunicipalities.filter(m =>
        m.label.toLowerCase().startsWith(municipalityQuery.toLocaleLowerCase())
    );

    return (
        <form
            action="/search"
            className={clsx(
                className,
                'flex flex-col gap-2 rounded-md bg-white p-6',
                'lg:flex-row lg:items-center lg:gap-0 lg:p-0'
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
                    `lg:w-[250px] lg:rounded-md lg:rounded-r-none lg:border`
                )}
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
                className={clsx(
                    `w-full rounded-none !border-0 !border-t !pb-0 `,
                    `lg:w-[250px] lg:rounded-md lg:rounded-l-none lg:rounded-r-none lg:border`
                )}
                label="type de logement"
                value={rentType}
                onChange={setRentType}
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
                name="noOfRooms"
                required
                min={1}
                className={clsx(
                    'rounded-none !border-0 !border-t',
                    'lg:rounded-md lg:rounded-l-none lg:rounded-r-none lg:border'
                )}
                label="Nombre de pièces"
                value={noOfRooms}
                onChange={setNoOfRooms}
                rootClassName={clsx(`w-full`, `lg:w-[250px]`)}
                showButtons
            />

            <NumberInput
                name="maxPrice"
                required
                className={clsx(
                    'rounded-none !border-0 !border-t',
                    'lg:rounded-md lg:rounded-l-none lg:border'
                )}
                label="Prix maximum"
                value={maxPrice}
                onChange={setMaxPrice}
                rootClassName={clsx(`w-full`, `lg:w-[250px]`)}
                appendix={
                    <div className="flex items-center gap-2">
                        <span>FCFA</span>
                        <Button
                            type="submit"
                            className="hidden"
                            aria-label="Appliquer les filtres de logement"
                            variant="primary"
                            square
                            renderLeadingIcon={cls => (
                                <MagnifyingGlass className={cls} />
                            )}
                        />
                    </div>
                }
            />

            <Button
                variant="primary"
                renderTrailingIcon={cls => <MagnifyingGlass className={cls} />}>
                Rechercher
            </Button>
        </form>
    );
}
