import * as React from 'react';
import { clsx } from '../../lib/functions';
import { Check } from 'phosphor-react';

export type CheckboxProps = {
    className?: string;
    variant?: 'primary' | 'secondary';
    label: string;
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
            className={clsx(className, 'flex items-center gap-2 group', {
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
                    'w-5 h-5 min-w-[1.25rem] ',
                    'rounded-md items-center justify-center flex',
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
                <Check
                    weight="bold"
                    className={clsx('text-white', {
                        hidden: !checked,
                        block: checked
                    })}
                />
            </div>
            <span
                className={clsx('font-semibold', {
                    'text-dark': checked,
                    'text-gray': !checked || disabled
                })}>
                {label}
            </span>
        </label>
    );
}
