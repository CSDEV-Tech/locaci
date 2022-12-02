/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import type { AriaListBoxOptions } from '@react-aria/listbox';
import type { ListState } from 'react-stately';
import type { Node } from '@react-types/shared';
import { useListBox, useListBoxSection, useOption } from 'react-aria';
import { CheckCircleIcon } from './icons/check-circle';
import { ListBoxOption } from '../molecules/search-autocomplete';
import { clsx } from '../../lib/functions';

interface ListBoxProps extends AriaListBoxOptions<ListBoxOption> {
    listBoxRef?: React.RefObject<HTMLUListElement>;
    state: ListState<ListBoxOption>;
    variant?: 'primary' | 'secondary';
}

interface SectionProps {
    section: Node<ListBoxOption>;
    state: ListState<ListBoxOption>;
}

interface OptionProps {
    item: Node<ListBoxOption>;
    state: ListState<ListBoxOption>;
    variant?: 'primary' | 'secondary';
}

export function ListBox(props: ListBoxProps) {
    let ref = React.useRef<HTMLUListElement>(null);
    let { listBoxRef = ref, state } = props;
    let { listBoxProps } = useListBox(props, state, listBoxRef);

    return (
        <ul
            {...listBoxProps}
            ref={listBoxRef}
            className="max-h-72 overflow-auto outline-none">
            {Array.from(state.collection).map(item =>
                item.type === 'section' ? (
                    <ListBoxSection
                        key={item.key}
                        section={item}
                        state={state}
                    />
                ) : (
                    <Option
                        key={item.key}
                        item={item}
                        state={state}
                        variant={props.variant}
                    />
                )
            )}
        </ul>
    );
}

function ListBoxSection({ section, state }: SectionProps) {
    let { itemProps, headingProps, groupProps } = useListBoxSection({
        heading: section.rendered,
        'aria-label': section['aria-label']
    });

    return (
        <>
            <li {...itemProps} className="pt-2">
                {section.rendered && (
                    <span
                        {...headingProps}
                        className="mx-3 text-xs font-bold uppercase text-gray-500">
                        {section.rendered}
                    </span>
                )}
                <ul {...groupProps}>
                    {Array.from(section.childNodes).map(node => (
                        <Option key={node.key} item={node} state={state} />
                    ))}
                </ul>
            </li>
        </>
    );
}

function Option({ item, state, variant = 'primary' }: OptionProps) {
    let ref = React.useRef<HTMLLIElement>(null);
    let { optionProps, isDisabled, isSelected, isFocused } = useOption(
        {
            key: item.key
        },
        state,
        ref
    );

    return (
        <li
            {...optionProps}
            ref={ref}
            className={clsx('flex items-center justify-between px-4 py-2', {
                'font-normal text-dark': !(isSelected || isFocused),
                'cursor-default text-gray': isDisabled,
                'cursor-pointer': !isDisabled,
                'font-semibold': isSelected,
                'text-white': isFocused,
                'bg-primary': isFocused && variant === 'primary',
                'bg-secondary': isFocused && variant === 'secondary'
            })}>
            {item.rendered}
            {isSelected && (
                <CheckCircleIcon
                    aria-hidden="true"
                    className={clsx('min-w-4 h-4', {
                        'text-primary': !isFocused && variant === 'primary',
                        'text-secondary': !isFocused && variant === 'secondary',
                        'text-white': isFocused
                    })}
                    weight="fill"
                />
            )}
        </li>
    );
}
