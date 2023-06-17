import * as React from 'react';
import AsyncSelect from 'react-select/async';

import type { OptionProps } from 'react-select';
import { CheckIcon } from '../atoms/icons/check';
import { clsx } from '../../lib/functions';
import { TextInput } from '../atoms/input';
import { CaretDownIcon } from '../atoms/icons/caret-down';

export type SelectOption<TValue extends any = {}> = {
    value: string;
    label: string;
} & TValue;

export interface AsyncSelectAutocompleteProps<TValue extends any = {}> {
    label: string;
    onSelect: (value: SelectOption<TValue> | null) => void;
    defaultOptions?: SelectOption<TValue>[];
    value?: SelectOption<TValue> | null;
    defaultValue?: SelectOption<TValue> | null;
    onSearch: (searchStr: string) => Promise<SelectOption<TValue>[]>;
    hintText?: string;
    layout?: 'horizontal' | 'vertical';
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean;
    initialQuery?: string;
    errorText?: string;
    autoFocus?: boolean;
    placeholderText?: string;
    name: string;
}

export function AsyncSelectAutocomplete<TValue>({
    onSearch,
    initialQuery,
    onSelect,
    value,
    defaultValue,
    label,
    errorText,
    hintText,
    placeholderText = 'Recherchez...',
    isLoading = false,
    name
}: AsyncSelectAutocompleteProps<TValue>) {
    const id = React.useId();

    return (
        <div className={``}>
            <label htmlFor={id}>{label}&nbsp;</label>
            <div className={clsx('')}>
                <div>
                    <AsyncSelect
                        cacheOptions
                        unstyled
                        id={id}
                        components={{
                            Option: CustomOption
                        }}
                        name={name}
                        loadOptions={onSearch}
                        defaultOptions
                        value={value}
                        defaultValue={defaultValue}
                        defaultInputValue={initialQuery}
                        isMulti={false}
                        onChange={newValue => {
                            onSelect(newValue);
                        }}
                        placeholder={placeholderText}
                        loadingMessage={() => (
                            <div className="empty">Recherche...</div>
                        )}
                        noOptionsMessage={() => (
                            <p className="">Aucun résulat trouvé</p>
                        )}
                        aria-labelledby={`${id}-error ${id}-hint`}
                        aria-invalid={Boolean(errorText)}
                        isLoading={isLoading}
                        classNames={{
                            control: () => 'todo',
                            input: () => 'todo',
                            container: () => 'todo',
                            valueContainer: () => 'todoer',
                            menuList: () => 'todo',
                            loadingIndicator: () => 'loading-indicator',
                            dropdownIndicator: () => 'chevron-indicator',
                            indicatorSeparator: () => 'todo',
                            indicatorsContainer: () => 'todo',
                            placeholder: () => 'todor'
                        }}
                    />
                </div>

                {errorText && (
                    <small className="" id={`${id}-error`}>
                        {errorText}
                    </small>
                )}

                {hintText && (
                    <span className="sr-only" id={`${id}-hint`}>
                        {hintText}
                    </span>
                )}
            </div>
        </div>
    );
}

function CustomOption(props: OptionProps<any>) {
    return (
        <div
            ref={props.innerRef}
            className={clsx('todo', {
                // todo: props.isFocused,
                // todo: props.isSelected
            })}
            {...props.innerProps}>
            <span
                className={clsx('todo', {
                    selected: props.isSelected
                })}>
                {props.children}
            </span>
            {props.isSelected && (
                <span className="todo">
                    <CheckIcon className="h-4 w-4" aria-hidden="true" />
                </span>
            )}
        </div>
    );
}
