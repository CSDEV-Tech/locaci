import * as React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { clsx } from '../../lib/functions';
import { CaretDownIcon } from './icons/caret-down';
import { CheckCircleIcon } from './icons/check-circle';

export type SelectProps = {
    value?: string;
    onChange: (newValue: string) => void;
    options?: Array<{ value: string; label: string }>;
    label: string;
    className?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    errorText?: string;
    helpText?: string;
    required?: boolean;
    name?: string;
};

export function Select({
    value,
    label,
    className,
    autoFocus,
    onChange,
    errorText,
    helpText,
    name,
    required = false,
    variant = 'primary',
    disabled = false,
    options = []
}: SelectProps) {
    const helpId = React.useId();
    const errorId = React.useId();
    const selected = options.find(option => option.value === value);
    return (
        <div className="flex flex-col gap-1">
            <div
                className={clsx(
                    className,
                    'group relative w-full rounded-md border px-4 pt-1 pb-2',
                    {
                        'bg-white': !disabled,
                        'cursor-not-allowed bg-lightgray': disabled,
                        'border-red-400': !!errorText,
                        'focus-within:ring-2 focus-within:ring-red-300':
                            !!errorText
                    }
                )}>
                <Listbox
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    name={name}>
                    {({ open }) => (
                        <>
                            <Listbox.Label className="text-sm font-normal text-gray">
                                {label}
                                {required && (
                                    <span
                                        aria-label="ce champ est requis"
                                        className="text-red-400">
                                        *
                                    </span>
                                )}
                            </Listbox.Label>

                            <Listbox.Button
                                disabled={disabled}
                                autoFocus={autoFocus}
                                className={clsx(
                                    'h-10 w-full text-start font-medium text-dark',
                                    'flex items-center justify-between',
                                    {
                                        'cursor-pointer': !disabled,
                                        'cursor-not-allowed': disabled
                                    }
                                )}>
                                <span>
                                    {selected?.label ?? 'Choisissez une option'}
                                </span>
                                <CaretDownIcon
                                    weight="bold"
                                    className={clsx('h-4 w-4', {
                                        'rotate-180': open
                                    })}
                                />
                            </Listbox.Button>

                            <Transition
                                as={React.Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95">
                                <Listbox.Options
                                    className={clsx(
                                        'flex flex-col rounded-md border bg-white py-3 shadow-card',
                                        'absolute top-[calc(100%+0.5rem)] left-0 right-0',
                                        'z-20 max-h-[300px] overflow-y-scroll'
                                    )}>
                                    {options.map(option => (
                                        <Listbox.Option
                                            key={option.value}
                                            value={option.value}
                                            className={({ active }) =>
                                                clsx(
                                                    'flex cursor-pointer items-center justify-between px-4 py-2',
                                                    {
                                                        'bg-primary':
                                                            active &&
                                                            variant ===
                                                                'primary',
                                                        'bg-secondary':
                                                            active &&
                                                            variant ===
                                                                'secondary'
                                                    }
                                                )
                                            }>
                                            {({ selected, active }) => (
                                                <>
                                                    <span
                                                        className={clsx('', {
                                                            'font-normal text-dark':
                                                                !(
                                                                    selected ||
                                                                    active
                                                                ),
                                                            'font-semibold':
                                                                selected,
                                                            'text-white': active
                                                        })}>
                                                        {option.label}
                                                    </span>

                                                    {selected && (
                                                        <CheckCircleIcon
                                                            className={clsx(
                                                                'min-w-4 h-4',
                                                                {
                                                                    'text-primary':
                                                                        !active &&
                                                                        variant ===
                                                                            'primary',
                                                                    'text-secondary':
                                                                        !active &&
                                                                        variant ===
                                                                            'secondary',
                                                                    'text-white':
                                                                        active
                                                                }
                                                            )}
                                                            weight="fill"
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </>
                    )}
                </Listbox>
            </div>

            {errorText && (
                <small
                    id={errorId}
                    aria-live={`assertive`}
                    role={`alert`}
                    className={`text-red-500`}>
                    {errorText}
                </small>
            )}
            {helpText && (
                <small id={helpId} className={`text-gray`}>
                    {helpText}
                </small>
            )}
        </div>
    );
}
