import * as React from 'react';
import { clsx } from '../../lib/functions';

export type LinkProps = {
    href: string;
    className?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    children?: React.ReactNode;
    Custom?: CustomLink;
};

export type CustomLink = React.ComponentType<Omit<LinkProps, 'custom'>>;

export function Link({ children, className, Custom, href, target }: LinkProps) {
    if (Custom) {
        return <Custom children={children} className={className} href={href} />;
    }

    return (
        <a
            className={clsx(className, 'hover:underline')}
            href={href}
            target={target}>
            {children}
        </a>
    );
}
