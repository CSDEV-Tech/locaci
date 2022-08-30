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
                `px-4 py-2 rounded-md gap-2 items-center justify-center focus:outline-none`,
                `font-bold focus:ring`,
                {
                    flex: block,
                    'inline-flex': !block,
                    '!px-2': square,
                    'bg-primary hover:bg-primary-75 active:bg-primary-75 ring-primary/50 text-white':
                        variant === 'primary',
                    'bg-secondary hover:bg-secondary-75 active:bg-secondary-75 ring-secondary/50 text-white':
                        variant === 'secondary',
                    'bg-lightgray text-dark ring-gray/50': variant === 'hollow',
                    'bg-transparent ring-gray/50 outline outline-1 outline-gray text-gray':
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
