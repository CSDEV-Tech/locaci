import * as React from 'react';
import { clsx } from '../../lib/functions';
import { CustomLink, Link } from '../atoms/link';

export type BreadcrumbItem = {
    href: string;
    label: string;
};

export type BreadcrumbProps = {
    links: Array<BreadcrumbItem>;
    className?: string;
    customLink?: React.ComponentType<CustomLink>;
};

export function Breadcrumb({ className, links, customLink }: BreadcrumbProps) {
    return (
        <nav aria-label="Fil d'Ariane" className={clsx(className, '')}>
            <ol className="flex items-center">
                {links.map((link, index) => (
                    <li
                        key={link.href}
                        className={clsx(
                            `overflow-hidden text-ellipsis whitespace-nowrap`,
                            {
                                'before:my-0 before:mx-2 before:inline-block before:rotate-[15deg]':
                                    index > 0,
                                'before:h-3 before:border-r before:border-r-dark':
                                    index > 0,
                                'min-w-[50%] font-semibold':
                                    index === links.length - 1
                            }
                        )}>
                        <Link
                            Custom={customLink}
                            href={link.href}
                            aria-current={
                                index === links.length - 1 ? 'page' : undefined
                            }>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
