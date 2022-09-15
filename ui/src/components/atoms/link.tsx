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
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

export type CustomLink = Omit<LinkProps, 'Custom'>;

export function Link({
    children,
    className,
    Custom,
    href,
    target,
    onClick,
    rel,
    'aria-label': ariaLabel,
    'aria-current': ariaCurrent
}: LinkProps) {
    if (Custom) {
        return (
            <Custom
                onClick={onClick}
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
            onClick={onClick}
            aria-label={ariaLabel}
            aria-current={ariaCurrent}
            className={clsx(className)}
            href={href}
            target={target}>
            {children}
        </a>
    );
}
