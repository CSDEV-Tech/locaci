import * as React from 'react';
import { clsx } from '../../lib/functions';

export type LinkProps = {
    href: string;
    className?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    children?: React.ReactNode;
    'aria-label'?: string;
    rel?: string;
    'aria-current'?: React.AriaAttributes['aria-current'];
    Custom?: React.ComponentType<CustomLink>;
};

export type CustomLink = Omit<LinkProps, 'Custom'>;

export function Link({
    children,
    className,
    Custom,
    href,
    target,
    rel,
    'aria-label': ariaLabel,
    'aria-current': ariaCurrent
}: LinkProps) {
    if (Custom) {
        return (
            <Custom
                rel={rel}
                aria-current={ariaCurrent}
                aria-label={ariaLabel}
                children={children}
                className={clsx(className)}
                href={href}
            />
        );
    }

    return (
        <a
            rel={rel}
            aria-label={ariaLabel}
            aria-current={ariaCurrent}
            className={clsx(className)}
            href={href}
            target={target}>
            {children}
        </a>
    );
}
