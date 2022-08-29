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
    loadingMessage?: string;
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
            loadingMessage = `Chargement, veuillez patientez...`,
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
                aria-label={ariaLabel}
                type={type}
                className={clsx(
                    className,
                    `px-4 py-2 rounded-md gap-2 items-center justify-center focus:outline-none`,
                    `font-bold`,
                    {
                        'focus:ring': !loading && !disabled,
                        flex: block,
                        'inline-flex': !block,
                        '!px-2': square,
                        'bg-primary ring-primary/50 text-white':
                            variant === 'primary',
                        'hover:bg-primary-75 active:bg-primary-75':
                            variant === 'primary' && !loading && !disabled,
                        'bg-secondary ring-secondary/50 text-white':
                            variant === 'secondary',
                        'hover:bg-secondary-75 active:bg-secondary-75':
                            variant === 'secondary' && !loading && !disabled,
                        'bg-lightgray text-dark ring-gray/50':
                            variant === 'hollow',
                        'cursor-default': loading || disabled,
                        'bg-transparent text-dark ring-gray/50':
                            variant === 'outline',
                        'bg-dark text-white ring-dark/50': variant === 'dark'
                    }
                )}
                onClick={ev => !disabled && !loading && onClick?.(ev)}>
                <span className="sr-only" aria-live="assertive">
                    {loading ? loadingMessage : ''}
                </span>
                {loading && <LoadingIndicator className={`h-5 w-5`} />}
                {!loading && renderLeadingIcon && renderLeadingIcon(`h-5 w-5`)}
                {children}
                {renderTrailingIcon && renderTrailingIcon(`h-5 w-5`)}
            </button>
        );
    }
);
