import * as React from 'react';
import { clsx } from '../../lib/functions';

export interface ButtonProps {
    title?: string;
    renderLeadingIcon?: (classNames: string) => JSX.Element;
    renderTrailingIcon?: (classNames: string) => JSX.Element;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    disabled?: boolean;
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'hollow' | 'outline' | 'dark';
    type?: 'button' | 'submit' | 'reset';
    ariaLabel?: string;
    square?: boolean;
    className?: string;
    loading?: boolean;
    block?: boolean;
}

export function Button({
    children,
    onClick,
    ariaLabel,
    renderTrailingIcon,
    renderLeadingIcon,
    className,
    title,
    type,
    loading = false,
    disabled = false,
    square = false,
    block = false,
    variant = `hollow`
}: ButtonProps) {
    return (
        <button
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
                        variant === `primary`,
                    'bg-secondary hover:bg-secondary-75 active:bg-secondary-75 ring-secondary/50 text-white':
                        variant === 'secondary',
                    'bg-lightgray text-dark ring-gray/50': variant === 'hollow',
                    'bg-gray !text-white cursor-not-allowed hover:bg-gray active:bg-gray':
                        loading || disabled,
                    'bg-transparent text-dark ring-gray/50':
                        variant === `outline`,
                    'bg-dark text-white ring-dark/50': variant === `dark`
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

function LoadingIndicator({ className }: { className?: string }) {
    return (
        <svg
            className={clsx(`animate-spin`, className)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
}
