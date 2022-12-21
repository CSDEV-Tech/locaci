'use client';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { SearchButton } from '@locaci/ui/components/atoms/search-button';

export function HeaderSearchButton() {
    const path = usePathname();
    return (
        <>
            {path !== '/' && (
                <SearchButton onClick={() => {}} className={`lg:hidden`}>
                    Lancez votre recherche
                </SearchButton>
            )}
        </>
    );
}
