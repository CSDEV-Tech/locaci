import * as React from 'react';
import { clsx } from '../../lib/functions';
import { CustomLink, Link } from '../atoms/link';

export type HeaderProps = {
    logoUrlMobile: string;
    logoUrlDesktop: string;
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
    logoUrlMobile,
    logoUrlDesktop,
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
                        'flex w-full items-center gap-2 min-w-0 grow-0',
                        'md:gap-4',
                        'lg:gap-8'
                    )}>
                    {!hideLogo && (
                        <Link Custom={customLink} href={logoHref}>
                            <img
                                src={logoUrlMobile}
                                alt={logoAltText}
                                className="h-10 w-10 object-contain object-center md:hidden"
                            />
                            <img
                                src={logoUrlDesktop}
                                alt={logoAltText}
                                className="hidden h-10 object-contain object-center md:inline"
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
