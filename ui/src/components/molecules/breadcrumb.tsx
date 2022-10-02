import * as React from 'react';
import { clsx } from '../../lib/functions';
import { CustomLink, Link } from '../atoms/link';

export type BreadcrumbItem = {
    href: string;
    label: string;
};

export type BreadcrumbProps = {
    items: Array<BreadcrumbItem>;
    className?: string;
    customLink?: React.ComponentType<CustomLink>;
};

export function Breadcrumb({ className, items, customLink }: BreadcrumbProps) {
    return (
        <nav aria-label="Fil d'Ariane" className={clsx(className, 'grow-0 min-w-0')}>
            <ol className="flex items-center grow-0 min-w-0">
                {items.map((item, index) => (
                    <li
                        key={item.href}
                        className={clsx(
                            `text-ellipsis whitespace-nowrap  shrink`,
                            {
                                'before:my-0 before:mx-2 before:inline-block before:rotate-[15deg]':
                                    index > 0,
                                'before:h-3 before:border-r before:border-r-dark':
                                    index > 0,
                                'min-w-fit font-semibold':
                                    index === items.length - 1,
                                'min-w-0 overflow-hidden': index !== items.length - 1
                            }
                        )}>
                        <Link
                            Custom={customLink}
                            href={item.href}
                            aria-current={
                                index === items.length - 1 ? 'page' : undefined
                            }>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
