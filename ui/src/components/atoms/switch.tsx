import * as React from 'react';
import { Switch as Toggle } from '@headlessui/react';
import { clsx } from '../../lib/functions';

export type SwitchProps = {
    checked?: boolean;
    onChange: (checked: boolean) => void;
    title?: string;
    variant?: 'primary' | 'secondary';
};

export function Switch({
    onChange,
    title,
    checked = false,
    variant = 'primary'
}: SwitchProps) {
    return (
        <Toggle
            checked={checked}
            onChange={onChange}
            className={clsx(
                `relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer items-center rounded-full border-2`,
                `border-transparent transition-colors duration-200 ease-in-out`,
                `focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`,
                {
                    'bg-lightgray': !checked,
                    'bg-primary': checked && variant === 'primary',
                    'bg-secondary': checked && variant === 'secondary'
                }
            )}>
            <span className="sr-only">{title}</span>
            <span
                aria-hidden="true"
                className={clsx(
                    `pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full`,
                    `shadow-lg ring-0 transition duration-200 ease-in-out`,
                    {
                        'translate-x-5 bg-white': checked,
                        'translate-x-[0.125rem] bg-gray': !checked
                    }
                )}
            />
        </Toggle>
    );
}
