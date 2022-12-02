import * as React from 'react';

import { Combobox, Transition } from '@headlessui/react';
import { clsx } from '../../lib/functions';
import { TextInput, TextInputProps } from '../atoms/input';
import { CaretDownIcon } from '../atoms/icons/caret-down';
import { CheckCircleIcon } from '../atoms/icons/check-circle';
import { LoadingIndicator } from '../atoms/loading-indicator';

export type ComboBoxProps = {
    value?: string;
    onChange: (newValue: string | null) => void;
    onSearch: (query: string) => void;
    isLoading?: boolean;
    options?: Array<{
        value: string;
        label: string;
        hint?: string;
        uniqueId?: string;
    }>;
    label: string;
    className?: string;
    inputClassName?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    errorText?: string;
    helpText?: string;
};

export function ComboBox({
    value,
    onChange,
    label,
    onSearch,
    autoFocus,
    disabled,
    className,
    inputClassName,
    errorText,
    helpText,
    isLoading = false,
    variant = 'primary',
    options = []
}: ComboBoxProps) {
    const selected = options.find(option => option.value === value) ?? null;

    return (
        <Combobox
            disabled={disabled}
            value={selected}
            onChange={newValue => {
                // if (newValue) {
                console.log('onChange : ', { newValue });

                onChange(newValue?.value ?? null);
                // }
            }}>
            {() => (
                <div className={clsx(className, 'relative w-full')}>
                    <div>
                        <Combobox.Input<
                            any,
                            { value: string; label: string } | null
                        >
                            as={CustomComboboxInput}
                            displayValue={option => option?.label ?? ''}
                            onChange={event => {
                                onSearch(event.target.value);
                            }}
                            errorText={errorText}
                            helpText={helpText}
                            label={label}
                            disabled={disabled}
                            className={inputClassName}
                            autoFocus={autoFocus}
                        />
                    </div>
                    <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Combobox.Options
                            className={clsx(
                                'flex flex-col rounded-md bg-white py-3 shadow-card',
                                'absolute top-[calc(100%+0.5rem)] left-0 right-0 z-10',
                                'max-h-[300px] overflow-y-scroll'
                            )}>
                            {options.length === 0 || isLoading ? (
                                <div
                                    className={clsx(
                                        'flex items-center justify-between px-4',
                                        {
                                            'text-gray': isLoading
                                        }
                                    )}>
                                    {isLoading
                                        ? 'Recherche...'
                                        : 'Aucun résultat trouvé'}

                                    {isLoading && (
                                        <LoadingIndicator
                                            className={`h-5 w-5`}
                                        />
                                    )}
                                </div>
                            ) : (
                                options.map(option => (
                                    <Combobox.Option
                                        key={option.uniqueId ?? option.value}
                                        value={option}
                                        className={({ active }) =>
                                            clsx(
                                                'flex cursor-pointer items-center justify-between px-4 py-2',
                                                {
                                                    'bg-primary':
                                                        active &&
                                                        variant === 'primary',
                                                    'bg-secondary':
                                                        active &&
                                                        variant === 'secondary'
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
                                                    {option.hint && (
                                                        <>
                                                            &nbsp;
                                                            <span className="font-normal">
                                                                {option.hint}
                                                            </span>
                                                        </>
                                                    )}
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
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            )}
        </Combobox>
    );
}

const CustomComboboxInput = React.forwardRef<HTMLInputElement, TextInputProps>(
    (props, ref) => {
        return (
            <TextInput
                {...props}
                ref={ref}
                autocomplete="off"
                appendix={
                    <Combobox.Button aria-label="Ouvrir le menu">
                        {({ open }) => (
                            <CaretDownIcon
                                weight="bold"
                                className={clsx('h-4 w-4', {
                                    'rotate-180': open
                                })}
                            />
                        )}
                    </Combobox.Button>
                }
            />
        );
    }
);
