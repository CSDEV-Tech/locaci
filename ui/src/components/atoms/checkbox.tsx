import * as React from 'react';
import { clsx } from '../../lib/functions';
import { CheckIcon } from './icons/check';

export type CheckboxProps = {
    className?: string;
    variant?: 'primary' | 'secondary';
    label: React.ReactNode;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (newValue: boolean) => void;
};

export function Checkbox({
    label,
    className,
    onChange,
    checked = false,
    disabled = false,
    variant = 'primary'
}: CheckboxProps) {
    return (
        <label
            className={clsx(className, 'group flex items-start gap-2', {
                'cursor-pointer': !disabled,
                'cursor-not-allowed': disabled
            })}>
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={ev => {
                    onChange?.(ev.target.checked);
                }}
                className={'sr-only'}
            />

            <div
                className={clsx(
                    'h-5 w-5 min-w-[1.25rem] ',
                    'flex items-center justify-center rounded-md',
                    'group-focus-within:ring-2',
                    {
                        'bg-lightgray': !checked,
                        'bg-gray': disabled,
                        'group-focus-within:ring-secondary/50':
                            !disabled && variant === 'secondary',
                        'group-focus-within:ring-primary/50':
                            !disabled && variant === 'primary',
                        'bg-primary':
                            !disabled && checked && variant === 'primary',
                        'bg-secondary':
                            !disabled && checked && variant === 'secondary'
                    }
                )}>
                <CheckIcon
                    weight="bold"
                    className={clsx('text-white', {
                        hidden: !checked,
                        block: checked
                    })}
                />
            </div>
            <span
                className={clsx('font-medium', {
                    'text-dark': checked,
                    'text-gray': !checked || disabled
                })}>
                {label}
            </span>
        </label>
    );
}
