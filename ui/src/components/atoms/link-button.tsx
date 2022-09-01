import * as React from 'react';
import { clsx } from '../../lib/functions';
import type { ButtonProps } from './button';
import { Link, LinkProps } from './link';

export type LinkButtonProps = Omit<
    ButtonProps,
    'type' | 'disabled' | 'loading'
> &
    LinkProps;

export function LinkButton({
    children,
    onClick,
    renderTrailingIcon,
    renderLeadingIcon,
    className,
    title,
    square = false,
    block = false,
    variant = `hollow`,
    ...linkProps
}: LinkButtonProps) {
    return (
        <Link
            className={clsx(
                className,
                `items-center justify-center gap-2 rounded-md px-4 py-2 focus:outline-none`,
                `font-bold focus:ring`,
                {
                    flex: block,
                    'inline-flex': !block,
                    '!px-2': square,
                    'bg-primary text-white ring-primary/50 hover:bg-primary-75 active:bg-primary-75':
                        variant === 'primary',
                    'bg-secondary text-white ring-secondary/50 hover:bg-secondary-75 active:bg-secondary-75':
                        variant === 'secondary',
                    'bg-lightgray text-dark ring-gray/50': variant === 'hollow',
                    'border border-gray bg-transparent text-gray ring-gray/50':
                        variant === 'outline',
                    'bg-dark text-white ring-dark/50': variant === 'dark'
                }
            )}
            {...linkProps}>
            {renderLeadingIcon && renderLeadingIcon(`h-5 w-5`)}
            {children}
            {renderTrailingIcon && renderTrailingIcon(`h-5 w-5`)}
        </Link>
    );
}
