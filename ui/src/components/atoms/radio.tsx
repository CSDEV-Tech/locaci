import * as React from 'react';
import { clsx } from '../../lib/functions';

export type RadioProps = {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    variant?: 'primary' | 'secondary';
    label: string;
    className?: string;
    disabled?: boolean;
};

export function Radio({
    className,
    label,
    onChange,
    variant = 'primary',
    disabled = false,
    checked = false
}: RadioProps) {
    return (
        <label
            className={clsx(className, 'group flex items-center gap-2', {
                'cursor-pointer': !disabled,
                'cursor-not-allowed': disabled
            })}
        >
            <input
                disabled={disabled}
                type="radio"
                checked={checked}
                className={'sr-only'}
                onChange={ev => {
                    if (ev.target.checked) {
                        onChange?.(true);
                    }
                }}
            />

            <div
                className={clsx(
                    'h-5 w-5 min-w-[1.25rem] ',
                    'flex items-center justify-center rounded-full',
                    'after:h-2 after:w-2',
                    {
                        'bg-lightgray after:hidden': !checked && !disabled,
                        'bg-gray': disabled,
                        'after:block after:rounded-full after:bg-white':
                            checked,
                        'bg-primary':
                            !disabled && checked && variant === 'primary',
                        'bg-secondary':
                            !disabled && checked && variant === 'secondary'
                    }
                )}
            />
            <span
                className={clsx('font-medium', {
                    'text-dark': checked,
                    'text-gray': !checked || disabled
                })}
            >
                {label}
            </span>
        </label>
    );
}
