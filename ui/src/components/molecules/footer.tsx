import * as React from 'react';
import { clsx } from '../../lib/functions';
import { CustomLink, Link } from '../atoms/link';
import { FacebookLogo, LinkedinLogo } from 'phosphor-react';

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
                <div className="p-10 bg-lightgray">
                    <ul
                        className={clsx(
                            'grid grid-cols-2 gap-8',
                            'max-w-[1200px] mx-auto',
                            'md:grid-cols-4'
                        )}>
                        {links?.map(({ links, title }) => (
                            <li key={title} className="flex flex-col gap-4">
                                <h3 className="font-bold">{title}</h3>
                                <ul className="font-normal flex flex-col gap-3 text-gray">
                                    {links?.map(({ label, href }) => (
                                        <li key={href}>
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

            <div className="p-4 bg-white">
                <div
                    className={clsx(
                        'flex flex-col gap-4',
                        'md:flex-row md:justify-between md:items-center',
                        'max-w-[1200px] mx-auto'
                    )}>
                    <ul className="flex flex-col gap-4 md:flex-row md:items-center">
                        <li className="text-gray">
                            &copy; 2022 locaci.net, Tous droits réservés
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
                    <ul className="flex gap-4 items-center">
                        <li>
                            <a
                                href="#"
                                target="_blank"
                                aria-label="Lien Facebook">
                                <FacebookLogo
                                    weight="fill"
                                    className="h-8 w-8 hover:text-[#2374e1] transition-colors duration-300"
                                />
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                target="_blank"
                                aria-label="Lien Linkedin">
                                <LinkedinLogo
                                    weight="fill"
                                    className="h-8 w-8 hover:text-[#0A66C2] transition-colors duration-300"
                                />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
