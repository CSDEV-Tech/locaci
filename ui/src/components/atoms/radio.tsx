import * as React from 'react';
import { clsx } from '../../lib/functions';

export type RadioProps = {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    variant?: 'primary' | 'secondary';
    label: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
};

export function Radio({
    className,
    label,
    onChange,
    variant = 'primary',
    disabled = false,
    checked = false,
    required = false
}: RadioProps) {
    return (
        <label
            className={clsx(className, 'flex items-center gap-2 group', {
                'cursor-pointer': !disabled,
                'cursor-not-allowed': disabled
            })}>
            <input
                disabled={disabled}
                type="radio"
                checked={checked}
                required={required}
                className={'hidden'}
                onChange={ev => {
                    if (ev.target.checked) {
                        onChange?.(true);
                    }
                }}
            />

            <div
                className={clsx(
                    'w-5 h-5 min-w-[1.25rem] ',
                    'rounded-full items-center justify-center flex',
                    'after:w-2 after:h-2',
                    {
                        'after:hidden bg-lightgray': !checked,
                        'after:bg-white after:rounded-full after:block':
                            checked,
                        'bg-primary': checked && variant === 'primary',
                        'bg-secondary': checked && variant === 'secondary'
                    }
                )}
            />
            <span
                className={clsx('font-semibold', {
                    'text-dark': checked,
                    'text-gray': !checked
                })}>
                {label}
            </span>
        </label>
    );
}
