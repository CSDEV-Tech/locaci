'use client';
import * as React from 'react';
// components
import { SearchBar } from '~/features/search/components/search-bar';
import { SearchButton } from '@locaci/ui/components/atoms/search-button';

// utils
import { usePathname, useSearchParams } from 'next/navigation';
import { clsx } from '@locaci/ui/lib/functions';

// types
import type { RentType } from '~/features/shared/types';
type HeaderSearchButtonProps = {
    defaultMunicipalities: { label: string; value: string }[];
};

export function HeaderSearchButton(props: HeaderSearchButtonProps) {
    const path = usePathname();
    const searchParams = useSearchParams();

    return (
        <>
            {path !== '/' && (
                <>
                    <SearchButton onClick={() => {}} className={`lg:hidden`}>
                        Lancez votre recherche
                    </SearchButton>
                    <SearchBar
                        minimalStyle
                        className={clsx(
                            'mx-auto hidden w-full shadow-md lg:flex',
                            'lg:mx-8 lg:w-fit lg:shadow-none'
                        )}
                        defaultValues={{
                            municipalityQuery: searchParams.get(
                                'municipalityId[label]'
                            ),
                            municipalityValue: searchParams.get(
                                'municipalityId[value]'
                            ),
                            rentType: searchParams.get(
                                'rentType'
                            ) as RentType | null
                        }}
                        defaultMunicipalities={props.defaultMunicipalities}
                    />
                </>
            )}
        </>
    );
}
