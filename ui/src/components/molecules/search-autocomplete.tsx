import * as React from 'react';
import { useButton, useComboBox, useFilter } from 'react-aria';
import { Item, useComboBoxState } from 'react-stately';

import { Button } from '../atoms/button';
import { ListBox } from '../atoms/listbox-ra';
import { Popover } from '../atoms/popover-ra';

export type AutocompleteOptionValue = {
    key: string;
    label: string;
};

export type SearchAutocompleteProps = {
    // className?: string;
    // inputClassName?: string;
    // autoFocus?: boolean;
    // disabled?: boolean;
    // variant?: 'primary' | 'secondary';
    // errorText?: string;
    // helpText?: string;
    isLoading?: boolean;
    initialQuery?: string;
    onChange: (newValue: string) => void;
    value?: string;
    label: string;
    options: Array<AutocompleteOptionValue>;
    children?: (item: AutocompleteOptionValue) => React.ReactNode;
    onSearch?: (query: string) => void;
};

export function SearchAutocomplete(props: SearchAutocompleteProps) {
    const [query, setQuery] = React.useState(props.initialQuery ?? '');

    function getItem(item: AutocompleteOptionValue) {
        return <Item key={item.key}>{item.label}</Item>;
    }

    // Setup filter function and state.
    const { contains } = useFilter({ sensitivity: 'base' });
    const state = useComboBoxState({
        items: props.options,
        inputValue: query,
        onInputChange: val => {
            setQuery(val);
            props.onSearch?.(val);
        },
        children: getItem,
        selectedKey: props.value,
        onSelectionChange: key => {
            setQuery(props.options.find(o => o.key === key)?.label ?? '');
            props.onChange?.(key.toString());
        },
        defaultFilter: contains
    });

    // Setup refs and get props for child elements.
    const buttonRef = React.useRef(null);
    const inputRef = React.useRef(null);
    const listBoxRef = React.useRef(null);
    const popoverRef = React.useRef(null);

    const {
        buttonProps: triggerProps,
        inputProps,
        listBoxProps,
        labelProps
    } = useComboBox(
        {
            children: getItem,
            inputRef,
            buttonRef,
            listBoxRef,
            popoverRef
        },
        state
    );

    const { buttonProps } = useButton(triggerProps, buttonRef);

    return (
        <div className="relative inline-flex flex-col">
            <label
                {...labelProps}
                className="block text-left text-sm font-medium text-gray-700">
                {props.label}
            </label>
            <div
                className={`relative inline-flex flex-row overflow-hidden rounded-md border-2 shadow-sm ${
                    state.isFocused ? 'border-pink-500' : 'border-gray-300'
                }`}>
                <input
                    {...inputProps}
                    ref={inputRef}
                    className="px-3 py-1 outline-none"
                />
                <Button
                    {...buttonProps}
                    ref={buttonRef}
                    loading={!!props.isLoading}
                    className={`cursor-default border-l-2 bg-gray-100 px-1 ${
                        state.isFocused
                            ? 'border-pink-500 text-pink-600'
                            : 'border-gray-300 text-gray-500'
                    }`}>
                    <span aria-hidden="true" style={{ padding: '0 2px' }}>
                        ▼
                    </span>
                </Button>
            </div>
            {state.isOpen && (
                <Popover
                    popoverRef={popoverRef}
                    isOpen={state.isOpen}
                    onClose={state.close}>
                    <ListBox
                        {...listBoxProps}
                        listBoxRef={listBoxRef}
                        state={state}
                    />
                </Popover>
            )}
        </div>
    );
}
