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
    name?: string;
    value?: string;
};

export function Checkbox({
    label,
    className,
    onChange,
    name,
    value,
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
                name={name}
                value={value}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={ev => {
                    onChange?.(ev.target.checked);
                }}
                className={'peer sr-only'}
            />

            <div
                aria-hidden={'true'}
                className={clsx(
                    'h-5 w-5 min-w-[1.25rem] ',
                    'bg-lightgray',
                    'flex items-center justify-center rounded-md',
                    'group-focus-within:ring-2',
                    'peer-disabled:bg-gray',
                    '[&>*]:hidden peer-checked:[&>*]:block',
                    {
                        'group-focus-within:ring-secondary/50':
                            variant === 'secondary',
                        'group-focus-within:ring-primary/50':
                            variant === 'primary',
                        'peer-checked:bg-primary': variant === 'primary',
                        'peer-checked:bg-secondary': variant === 'secondary'
                    }
                )}>
                <CheckIcon weight="bold" className={clsx('text-white')} />
            </div>

            <span
                className={clsx(
                    'font-medium text-gray peer-checked:text-dark'
                )}>
                {label}
            </span>
        </label>
    );
}
