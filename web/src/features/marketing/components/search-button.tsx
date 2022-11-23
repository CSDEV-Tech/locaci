'use client';

import { SearchButton } from '@locaci/ui/components/atoms/search-button';
import { NextLink } from '~/features/shared/components/next-link';

export function SearchButtonMarketing() {
    return (
        <>
            <SearchButton
                className="lg:hidden"
                href="/search"
                customLink={NextLink}>
                Rechercher un logement
            </SearchButton>
        </>
    );
}
