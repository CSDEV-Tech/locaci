import { Combobox } from '@headlessui/react';
import * as React from 'react';
import { clsx } from '../../lib/functions';
import { TextInput } from './input';
import { CaretDown, Check, CheckCircle } from 'phosphor-react';
import { LoadingIndicator } from './loading-indicator';

export type ComboBoxProps = {
    value?: string;
    onChange: (newValue: string | null) => void;
    onSearch: (query: string) => void;
    isLoading?: boolean;
    options?: Array<{ value: string; label: string }>;
    label: string;
    className?: string;
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
    className,
    disabled,
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
            }}>
            {({ open }) => (
                <div className={clsx(className, 'relative')}>
                    <div>
                        <Combobox.Input<
                            'div',
                            { value: string; label: string } | null
                        >
                            displayValue={option => option?.label ?? ''}
                            as={'div'}
                            onChange={() => {}}>
                            {() => {
                                return (
                                    <TextInput
                                        label={label}
                                        disabled={disabled}
                                        autoFocus={autoFocus}
                                        value={query}
                                        autocomplete="off"
                                        appendix={
                                            <Combobox.Button>
                                                <CaretDown
                                                    weight="bold"
                                                    className={clsx({
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
                    <Combobox.Options
                        className={clsx(
                            'bg-white py-3 flex flex-col rounded-md',
                            'absolute top-[calc(100%+0.5rem)] left-0 right-0'
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
                                    <LoadingIndicator className={`h-5 w-5`} />
                                )}
                            </div>
                        ) : (
                            options.map(option => (
                                <Combobox.Option
                                    key={option.value}
                                    value={option}
                                    className={({ active }) =>
                                        clsx(
                                            'cursor-pointer px-4 py-2 flex items-center justify-between',
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
                                                    'text-dark font-normal': !(
                                                        selected || active
                                                    ),
                                                    'font-semibold': selected,
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
                                                            'text-white': active
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
                </div>
            )}
        </Combobox>
    );
}
