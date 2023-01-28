import * as React from 'react';
// components
import { Header as UIHeader } from '@locaci/ui/components/organisms/header';
import { RemixLink } from './remix-link';
import { HeaderSearchButton } from '~/www/features/search/components/header-search-button';

// types
export type HeaderProps = {
    trailingElement?: React.ReactNode;
    defaultMunicipalities: { label: string; value: string }[];
};

export function Header({
    trailingElement,
    defaultMunicipalities
}: HeaderProps) {
    return (
        <>
            <UIHeader
                logoHref={`/`}
                customLink={RemixLink}
                logoAltText="Logo LOCACI"
                className="lg:shadow-md"
                logoUrlDesktop="/logo.svg"
                logoUrlMobile="/logo.svg"
                leadingElement={
                    <HeaderSearchButton
                        defaultMunicipalities={defaultMunicipalities}
                    />
                }
                trailingElement={trailingElement}
            />
        </>
    );
}
