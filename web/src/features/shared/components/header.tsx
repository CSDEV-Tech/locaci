import * as React from 'react';
// components
import { Header as UIHeader } from '@locaci/ui/components/organisms/header';
import { HeaderSearchButton } from '~/features/public/components/header-search-button';

// utils
import { getAllMunicipalities } from '~/server/trpc/rsc/cached-queries';
import { NextLink } from './next-link';

// types
export type HeaderProps = {
    trailingElement?: React.ReactNode;
};

export function Header({ trailingElement }: HeaderProps) {
    const municipalitiesPromise = getAllMunicipalities().then(result =>
        result.map(m => ({ label: m.name, value: m.id }))
    );
    return (
        <>
            <UIHeader
                logoHref={`/`}
                customLink={NextLink}
                logoAltText="Logo LOCACI"
                className="relative z-50 lg:shadow-md"
                logoUrl="/logo.svg"
                leadingElement={
                    <HeaderSearchButton
                        defaultMunicipalities={React.use(municipalitiesPromise)}
                    />
                }
                trailingElement={trailingElement}
            />
        </>
    );
}
