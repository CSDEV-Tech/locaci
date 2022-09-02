import { Combobox, Transition } from '@headlessui/react';
import * as React from 'react';
import { clsx } from '../../lib/functions';
import { TextInput } from './input';
import { CaretDown, CheckCircle } from 'phosphor-react';
import { LoadingIndicator } from './loading-indicator';

export type ComboBoxProps = {
    value?: string;
    onChange: (newValue: string | null) => void;
    onSearch: (query: string) => void;
    isLoading?: boolean;
    options?: Array<{ value: string; label: string }>;
    label: string;
    className?: string;
    inputClassName?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
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
    isLoading = false,
    variant = 'primary',
    options = []
}: ComboBoxProps) {
    const selected = options.find(option => option.value === value) ?? null;
    const [query, setQuery] = React.useState(selected?.label ?? '');
    const lastSelected = React.useRef<{ value: string; label: string } | null>(
        null
    );

    return (
        <Combobox
            disabled={disabled}
            value={selected}
            onChange={newValue => {
                // ne pas appeler onChange si la valeur est la même que la dernière selection
                if (newValue && newValue.value !== value) {
                    lastSelected.current = newValue;
                    onChange(newValue?.value ?? null);
                    setQuery(newValue.label);
                }
            }}
        >
            {({ open }) => (
                <div className={clsx(className, 'relative w-full')}>
                    <div>
                        <Combobox.Input<
                            'div',
                            { value: string; label: string } | null
                        >
                            displayValue={option => option?.label ?? ''}
                            as={'div'}
                            onChange={() => {}}
                        >
                            {() => {
                                return (
                                    <TextInput
                                        label={label}
                                        disabled={disabled}
                                        className={inputClassName}
                                        autoFocus={autoFocus}
                                        value={query}
                                        autocomplete="off"
                                        appendix={
                                            <Combobox.Button aria-label="Ouvrir le menu">
                                                <CaretDown
                                                    weight="bold"
                                                    className={clsx('h-4 w-4', {
                                                        'rotate-180': open
                                                    })}
                                                />
                                            </Combobox.Button>
                                        }
                                        onChange={query => {
                                            setQuery(query);
                                            onChange(null);
                                            onSearch(query);
                                        }}
                                        onBlur={() => {
                                            setQuery(
                                                lastSelected.current?.label ??
                                                    ''
                                            );
                                            // Return the selected value in the select if it has been modified
                                            if (
                                                selected === null &&
                                                lastSelected.current !== null
                                            ) {
                                                onChange(
                                                    lastSelected.current.value
                                                );
                                            }
                                        }}
                                    />
                                );
                            }}
                        </Combobox.Input>
                    </div>
                    <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Combobox.Options
                            className={clsx(
                                'flex flex-col rounded-md bg-white py-3',
                                'absolute top-[calc(100%+0.5rem)] left-0 right-0',
                                'max-h-[300px] overflow-y-scroll'
                            )}
                        >
                            {options.length === 0 || isLoading ? (
                                <div
                                    className={clsx(
                                        'flex items-center justify-between px-4',
                                        {
                                            'text-gray': isLoading
                                        }
                                    )}
                                >
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
                                        key={option.value}
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
                                        }
                                    >
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
                                                    })}
                                                >
                                                    {option.label}
                                                </span>

                                                {selected && (
                                                    <CheckCircle
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
