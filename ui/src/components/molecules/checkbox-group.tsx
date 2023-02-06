import * as React from 'react';
import { clsx } from '../../lib/functions';
import { Checkbox } from '../atoms/checkbox';

export type CheckboxGroupProps = {
    label?: string;
    options: {
        value: string;
        label: string;
    }[];
    value?: string[];
    className?: string;
    onChange: (newValue: string[]) => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    display?: 'grid' | 'column';
    name?: string;
};

export function CheckboxGroup({
    label,
    className,
    onChange,
    options,
    value = [],
    name,
    display = 'column',
    disabled = false,
    variant = 'primary'
}: CheckboxGroupProps) {
    const labelId = React.useId();

    const handleChange = (itemValue: string) => {
        if (value.includes(itemValue)) {
            onChange?.(value.filter(item => item !== itemValue));
        } else {
            onChange?.([...value, itemValue]);
        }
    };

    return (
        <div
            className={clsx(className, 'flex flex-col gap-2')}
            role={'group'}
            aria-labelledby={labelId}>
            <label id={labelId} className="font-semibold text-dark">
                {label}
            </label>

            <ul
                className={clsx('gap-2', {
                    'flex flex-col': display === 'column',
                    'grid grid-cols-2': display === 'grid'
                })}>
                {options.map(({ label, value: itemValue }) => (
                    <Checkbox
                        name={name}
                        variant={variant}
                        disabled={disabled}
                        value={itemValue}
                        key={itemValue}
                        label={label}
                        checked={value.includes(itemValue)}
                        onChange={() => {
                            handleChange(itemValue);
                        }}
                    />
                ))}
            </ul>
        </div>
    );
}
