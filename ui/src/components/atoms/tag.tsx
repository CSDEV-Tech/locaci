import * as React from 'react';
import { clsx } from '../../lib/functions';

export type TagProps = {
    variant?:
        | 'primary'
        | 'primary-light'
        | 'secondary'
        | 'secondary-light'
        | 'accent-primary'
        | 'hollow';
    onRemove?: () => void;
    children?: React.ReactNode;
    className?: string;
    isSquared?: boolean;
};

export function Tag({
    onRemove,
    children,
    className,
    isSquared = false,
    variant = 'hollow'
}: TagProps) {
    return (
        <span
            className={clsx(
                className,
                'inline-flex items-center gap-2 rounded-md px-4 font-semibold',
                {
                    'py-4': isSquared,
                    'py-2': !isSquared,
                    'bg-primary text-white': variant === `primary`,
                    'bg-primary-15 text-primary': variant === `primary-light`,
                    'bg-secondary text-white': variant === `secondary`,
                    'bg-secondary-15 text-secondary':
                        variant === `secondary-light`,
                    'bg-accent-primary text-dark': variant === `accent-primary`,
                    'bg-lightgray text-gray': variant === 'hollow'
                }
            )}>
            {children}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className={`inline-flex h-full items-center justify-center p-1`}>
                    <CloseButton className={`h-4`} />
                </button>
            )}
        </span>
    );
}

function CloseButton({ className }: { className: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            fill="currentColor"
            viewBox="0 0 256 256">
            <rect width="256" height="256" fill="none"></rect>
            <line
                x1="200"
                y1="56"
                x2="56"
                y2="200"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="24"></line>
            <line
                x1="200"
                y1="200"
                x2="56"
                y2="56"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="24"></line>
        </svg>
    );
}
