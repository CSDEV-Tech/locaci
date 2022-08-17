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
};

export function CheckboxGroup({
    label,
    className,
    onChange,
    options,
    value = [],
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

            {options.map(({ label, value: itemValue }) => (
                <Checkbox
                    variant={variant}
                    disabled={disabled}
                    key={itemValue}
                    label={label}
                    checked={value.includes(itemValue)}
                    onChange={() => {
                        handleChange(itemValue);
                    }}
                />
            ))}
        </div>
    );
}
