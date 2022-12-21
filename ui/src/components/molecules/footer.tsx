import * as React from 'react';
import { clsx } from '../../lib/functions';
import { CustomLink, Link } from '../atoms/link';
import { FacebookLogoIcon } from '../atoms/icons/facebook-logo';
import { LinkedinLogoIcon } from '../atoms/icons/linkedin-logo';

export type NavLinks = {
    title: string;
    links: Array<{
        label: string;
        href: string;
    }>;
};

export type FooterProps = {
    className?: string;
    links: NavLinks[];
    customLink?: React.ComponentType<CustomLink>;
};

export function Footer({ className, links, customLink }: FooterProps) {
    return (
        <footer className={clsx(className, 'w-full')}>
            {links?.length > 0 && (
                <div className="bg-lightgray p-10">
                    <ul
                        className={clsx(
                            'grid gap-8',
                            'mx-auto max-w-[1200px]',
                            'sm:grid-cols-2 md:grid-cols-4'
                        )}>
                        {links?.map(({ links, title }) => (
                            <li key={title} className="flex flex-col gap-4">
                                <h3 className="font-bold">{title}</h3>
                                <ul className="flex flex-col gap-3 font-normal text-gray">
                                    {links?.map(({ label, href }, index) => (
                                        <li key={index}>
                                            <Link
                                                Custom={customLink}
                                                href={href}
                                                className="hover:underline">
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div
                className={clsx(' p-4', {
                    'bg-white': links?.length > 0,
                    'bg-lightgray': links?.length === 0
                })}>
                <div
                    className={clsx(
                        'flex flex-col gap-4',
                        'md:flex-row md:items-center md:justify-between',
                        'mx-auto max-w-[1200px]'
                    )}>
                    <ul className="flex flex-col gap-4 md:flex-row md:items-center">
                        <li className="text-gray">
                            &copy; {(new Date).getFullYear()} locaci.net, Tous droits réservés
                        </li>
                        <li>
                            <Link
                                Custom={customLink}
                                href="/mentions-legales"
                                className="font-semibold">
                                Mentions légales
                            </Link>
                        </li>
                    </ul>
                    <ul className="flex items-center gap-4">
                        <li>
                            <a
                                href="#"
                                target="_blank"
                                aria-label="Lien Facebook">
                                <FacebookLogoIcon className="h-8 w-8 transition-colors duration-300 hover:text-[#2374e1]" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                target="_blank"
                                aria-label="Lien Linkedin">
                                <LinkedinLogoIcon className="h-8 w-8 transition-colors duration-300 hover:text-[#0A66C2]" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
