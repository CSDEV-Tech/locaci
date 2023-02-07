import * as React from 'react';
import { clsx } from '../../lib/functions';
import { CustomLink, Link } from '../atoms/link';

export type HeaderProps = {
    logoUrl: string;
    logoAltText: string;
    hideLogo?: boolean;
    logoHref?: string;
    className?: string;
    customLink?: React.ComponentType<CustomLink>;
    /**
     * the content displayed aside the logo
     */
    leadingElement?: React.ReactNode;
    /**
     * the content displayed at the end of the header
     */
    trailingElement?: React.ReactNode;
};

export function Header({
    className,
    customLink,
    leadingElement,
    trailingElement,
    logoUrl,
    logoAltText,
    hideLogo = false,
    logoHref = '#'
}: HeaderProps) {
    return (
        <header
            className={clsx(
                className,
                'lg:shadow-header bg-white p-4',
                'md:px-8 md:py-6'
            )}>
            <ul className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
                <li
                    className={clsx(
                        'flex w-full min-w-0 grow-0 items-center gap-2',
                        'md:gap-4',
                        'lg:gap-8'
                    )}>
                    {!hideLogo && (
                        <Link
                            Custom={customLink}
                            href={logoHref}
                            aria-label={"Page d'accueil LOCACI"}>
                            <img
                                src={logoUrl}
                                alt={logoAltText}
                                className="h-8 flex-shrink-0 object-contain object-center md:inline md:h-10"
                            />
                        </Link>
                    )}

                    {leadingElement}
                </li>

                <li>{trailingElement}</li>
            </ul>
        </header>
    );
}
