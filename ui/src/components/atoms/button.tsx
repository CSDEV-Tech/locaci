import * as React from 'react';
import { clsx } from '../../lib/functions';
import { LoadingIndicator } from './loading-indicator';

export interface ButtonProps {
    title?: string;
    renderLeadingIcon?: (classNames: string) => JSX.Element;
    renderTrailingIcon?: (classNames: string) => JSX.Element;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    disabled?: boolean;
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'hollow' | 'outline' | 'dark';
    type?: 'button' | 'submit' | 'reset';
    'aria-label'?: string;
    square?: boolean;
    className?: string;
    loading?: boolean;
    block?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            onClick,
            renderTrailingIcon,
            renderLeadingIcon,
            className,
            title,
            type,
            'aria-label': ariaLabel,
            loading = false,
            disabled = false,
            square = false,
            block = false,
            variant = `hollow`
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                title={title}
                disabled={disabled || loading}
                aria-label={ariaLabel}
                type={type}
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
                        'bg-lightgray text-dark ring-gray/50':
                            variant === 'hollow',
                        'disabled:bg-gray disabled:text-white disabled:cursor-not-allowed disabled:hover:bg-gray disabled:active:bg-gray':
                            loading || disabled,
                        'bg-transparent text-dark ring-gray/50':
                            variant === 'outline',
                        'bg-dark text-white ring-dark/50': variant === 'dark'
                    }
                )}
                onClick={onClick}>
                {loading && <LoadingIndicator className={`h-5 w-5`} />}
                {!loading && renderLeadingIcon && renderLeadingIcon(`h-5 w-5`)}
                {children}
                {renderTrailingIcon && renderTrailingIcon(`h-5 w-5`)}
            </button>
        );
    }
);
