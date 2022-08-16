import * as React from 'react';
import { clsx } from '../../lib/functions';
import { RadioGroup as HeadlessUIRadioGroup } from '@headlessui/react';
import { Radio } from '../atoms/radio';

export type RadioGroupProps = {
    label: string;
    options: {
        value: string;
        label: string;
    }[];
    value?: string;
    className?: string;
    onChange: (newValue: string) => void;
    variant?: 'primary' | 'secondary';
};

export function RadioGroup({
    options,
    value,
    onChange,
    className,
    label,
    variant = 'primary'
}: RadioGroupProps) {
    return (
        <HeadlessUIRadioGroup
            value={value}
            onChange={onChange}
            className={clsx(className, 'flex flex-col gap-2')}>
            <HeadlessUIRadioGroup.Label className={'font-semibold'}>
                {label}
            </HeadlessUIRadioGroup.Label>

            {options.map(({ value, label }) => (
                <HeadlessUIRadioGroup.Option value={value} key={value}>
                    {({ checked }) => (
                        <Radio
                            variant={variant}
                            checked={checked}
                            label={label}
                        />
                    )}
                </HeadlessUIRadioGroup.Option>
            ))}
        </HeadlessUIRadioGroup>
    );
}
