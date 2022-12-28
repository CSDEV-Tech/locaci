import * as React from 'react';
import { clsx } from '../../lib/functions';
import { LoadingIndicator } from './loading-indicator';

export type ButtonProps = {
    title?: string;
    renderLeadingIcon?: (classNames: string) => JSX.Element;
    renderTrailingIcon?: (classNames: string) => JSX.Element;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    disabled?: boolean;
    children?: React.ReactNode;
    variant?:
        | 'primary'
        | 'secondary'
        | 'hollow'
        | 'outline'
        | 'dark'
        | 'danger';
    type?: 'button' | 'submit' | 'reset';
    role?: string;
    loadingMessage?: string;
    square?: boolean;
    circle?: boolean;
    className?: string;
    loading?: boolean;
    block?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

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
            loading = false,
            circle = false,
            disabled = false,
            square = false,
            block = false,
            variant = `hollow`,
            ...buttonProps
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                title={title}
                type={type}
                className={clsx(
                    className,
                    `items-center justify-center gap-2`,
                    `border py-2`,
                    `font-medium`,
                    {
                        'focus:ring [&[aria-pressed=true]]:ring':
                            !loading && !disabled,
                        flex: block,
                        'inline-flex': !block,
                        'px-2': square || circle,
                        'px-4': !square && !circle,
                        'rounded-full': circle,
                        'rounded-md': !circle,
                        'cursor-default': loading || disabled,
                        'bg-primary text-white ring-primary/50 focus:outline-none':
                            variant === 'primary',
                        'bg-danger text-white ring-danger/50 focus:outline-none':
                            variant === 'danger',
                        'hover:bg-danger-75 active:bg-danger-75':
                            variant === 'danger' && !loading && !disabled,
                        'hover:bg-primary-75 active:bg-primary-75':
                            variant === 'primary' && !loading && !disabled,
                        'bg-secondary text-white ring-secondary/50 focus:outline-none':
                            variant === 'secondary',
                        'hover:bg-secondary-75 active:bg-secondary-75':
                            variant === 'secondary' && !loading && !disabled,
                        'bg-lightgray text-dark ring-gray/50 focus:outline-none':
                            variant === 'hollow',
                        'bg-transparent text-gray ring-gray/50':
                            variant === 'outline',
                        'border-gray': variant === 'outline',
                        'border-transparent': variant !== 'outline',
                        'bg-dark text-white ring-dark/50': variant === 'dark',
                        'hover:bg-dark-75 active:bg-dark-75':
                            variant === 'dark' && !loading && !disabled
                    }
                )}
                onClick={ev => !disabled && !loading && onClick?.(ev)}
                {...buttonProps}>
                <span className="sr-only" aria-live="assertive">
                    {loading ? loadingMessage : ''}
                </span>
                {loading && (
                    <LoadingIndicator className={`h-5 w-5 flex-shrink-0`} />
                )}
                {!loading &&
                    renderLeadingIcon &&
                    renderLeadingIcon(`h-5 w-5 flex-shrink-0`)}
                {children}
                {renderTrailingIcon &&
                    renderTrailingIcon(`h-5 w-5 flex-shrink-0`)}
            </button>
        );
    }
);
