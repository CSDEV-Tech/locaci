import * as React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { clsx } from '../../lib/functions';
import { CaretDown, CheckCircle } from 'phosphor-react';

export type SelectProps = {
    value?: string;
    onChange: (newValue: string) => void;
    options?: Array<{ value: string; label: string }>;
    label: string;
    className?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
};

export function Select({
    value,
    label,
    className,
    autoFocus,
    onChange,
    variant = 'primary',
    disabled = false,
    options = []
}: SelectProps) {
    const selected = options.find(option => option.value === value);
    return (
        <>
            <div
                className={clsx(
                    className,
                    'px-4 pt-1 pb-2 rounded-md border relative group w-full',
                    {
                        'bg-white': !disabled,
                        'bg-lightgray cursor-not-allowed': disabled
                    }
                )}>
                <Listbox value={value} onChange={onChange} disabled={disabled}>
                    {({ open }) => (
                        <>
                            <Listbox.Label className="text-sm text-gray font-normal">
                                {label}
                            </Listbox.Label>

                            <Listbox.Button
                                disabled={disabled}
                                autoFocus={autoFocus}
                                className={clsx(
                                    'h-10 w-full font-semibold text-dark text-start',
                                    'flex items-center justify-between',
                                    {
                                        'cursor-pointer': !disabled,
                                        'cursor-not-allowed': disabled
                                    }
                                )}>
                                <span>
                                    {selected?.label ?? 'Choisissez une option'}
                                </span>
                                <CaretDown
                                    weight="bold"
                                    className={clsx({
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
                                        'bg-white py-3 flex flex-col rounded-md border shadow-card',
                                        'absolute top-[calc(100%+0.5rem)] left-0 right-0',
                                        'max-h-[300px] overflow-y-scroll'
                                    )}>
                                    {options.map(option => (
                                        <Listbox.Option
                                            key={option.value}
                                            value={option.value}
                                            className={({ active }) =>
                                                clsx(
                                                    'cursor-pointer px-4 py-2 flex items-center justify-between',
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
                                                            'text-dark font-normal':
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
                                                        <CheckCircle
                                                            className={clsx(
                                                                'h-4 min-w-4',
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
        </>
    );
}
